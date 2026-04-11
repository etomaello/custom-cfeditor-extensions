const ITEMS_IN_DROPDOWN = 10;
const DEFAULT_HEIGHT = 75;
const ITEM_HEIGHT = 30;

export const useHeightControl = (guestConnection) => {
  const onOpenComboBoxSetHeight = (isOpen) => {
    if (isOpen) {
      guestConnection.host.field.setHeight(
        DEFAULT_HEIGHT + ITEMS_IN_DROPDOWN * ITEM_HEIGHT,
      );
    } else {
      guestConnection.host.field.setHeight(DEFAULT_HEIGHT);
    }
  };

  return { onOpenComboBoxSetHeight };
};
