import React, { useEffect, useState, useCallback } from 'react';
import { extensionId } from '../../utils/constants';
import {
  Provider,
  defaultTheme,
  TableView,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
  Text,
} from '@adobe/react-spectrum';
import { useFieldExtension } from '../../hooks/use-field-extension';
import useAutoResizeIframe from '../../hooks/use-auto-resize-iframe';
import useBackgroundColorSetting from '../../hooks/use-background-color-setting';

export default function JsonViewerField() {
  const [columns, setColumns] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const {
    guestConnection,
    fieldsValues,
    model,
    inputValue: eamInputValue,
  } = useFieldExtension(extensionId, () => {});
  useAutoResizeIframe(guestConnection);
  const { backgroundColorSetting, theme } =
    useBackgroundColorSetting(guestConnection);
  const [labelColor, setLabelColor] = useState('light');

  useEffect(() => {
    backgroundColorSetting();
    const color = theme === 'light' ? '#464646' : '#d0d0d0';
    setLabelColor(color);
  }, [backgroundColorSetting, theme]);

  const setTableValues = useCallback(() => {
    if (!eamInputValue) {
      setJsonData([]);
      setColumns([]);
      return;
    }
    let columnsAux = [
      { key: 'nome', label: 'Nome' },
      { key: 'precoDesconto', label: 'Preço Desconto' },
      { key: 'precoTotal', label: 'Preço Total' },
    ];
    try {
      const parsedData = JSON.parse(eamInputValue);

      const isSvaFormat =
        !!Object.values(parsedData)[0]?.codigoProduto === true;

      if (isSvaFormat) {
        columnsAux = [
          ...columnsAux,
          { key: 'precoSva', label: 'Preço SVA' },
          { key: 'codigoProduto', label: 'Código Produto' },
          { key: 'nomeProduto', label: 'Nome Produto' },
        ];
      } else {
        columnsAux = [
          ...columnsAux,
          { key: 'precoProduto', label: 'Preço Produto' },
          { key: 'precoTotalSemSva', label: 'Preço Total Sem SVA' },
        ];
      }
      setColumns(columnsAux);
      setJsonData(Object.values(parsedData));
    } catch (error) {
      setJsonData([]);
      setColumns([]);
    }
  }, [eamInputValue]);

  useEffect(() => {
    setTableValues();
  }, [setTableValues]);

  if (!model || !fieldsValues || !columns.length || !jsonData.length) {
    return <Provider theme={defaultTheme}>Loading custom field...</Provider>;
  }

  return (
    <Provider
      theme={defaultTheme}
      locale={guestConnection.sharedContext.get('locale')}
    >
      <div style={{ marginBottom: '16px' }}>
        <Text UNSAFE_style={{ fontSize: '12px', color: labelColor }}>
          {model.fieldLabel}
        </Text>
      </div>
      <TableView
        aria-label="Tabela de usuários"
        selectionMode="none"
        width="100%"
      >
        <TableHeader>
          {columns.map((col) => (
            <Column key={col.key} allowsResizing>
              {col.label}
            </Column>
          ))}
        </TableHeader>
        <TableBody items={jsonData}>
          {(item) => (
            <Row key={item.nome}>
              {columns.map((col) => (
                <Cell key={`${item.nome}-${col.key}`}>
                  {col.key.startsWith('preco') &&
                  typeof item[col.key] === 'number'
                    ? `R$ ${item[col.key].toFixed(2)}`
                    : item[col.key] || '-'}
                </Cell>
              ))}
            </Row>
          )}
        </TableBody>
      </TableView>
    </Provider>
  );
}
