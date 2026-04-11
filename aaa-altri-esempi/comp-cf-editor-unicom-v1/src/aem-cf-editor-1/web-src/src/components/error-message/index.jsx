import React from 'react';
import { Link } from '@adobe/react-spectrum';

export default function ErrorMessage({ message, linkHref, linkText }) {
  return (
    <>
      {message}
      {linkHref && (
        <Link href={linkHref} target="_blank">
          {linkText}
        </Link>
      )}
    </>
  );
}
