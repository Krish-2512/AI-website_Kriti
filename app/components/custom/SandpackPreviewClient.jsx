import { SandpackPreview, useSandpack } from '@codesandbox/sandpack-react'
import React, { useContext, useEffect } from 'react'
import { useRef } from 'react';
import { ActionContext } from '../../context/ActionContext';

function SandpackPreviewClient() {
  const previewRef = useRef();
  const { sandpack } = useSandpack();
  const { action, setAction } = useContext(ActionContext);

  useEffect(() => {
    GetSandpackClient();
  }, [sandpack && action]);

  const GetSandpackClient = async () => {
    const client = previewRef.current?.getClient();
    if (client) {
      const result = await client.getCodeSandboxURL();
      if (action?.actionType === 'deploy') {
        window.open('https://' + result?.sandboxId + '.csb.app/');
      } else if (action?.actionType === 'export') {
        window.open(result?.editorUrl);
      }
    }
  };

  return (
    <SandpackPreview
      ref={previewRef}
      style={{ height: '100%', minHeight: '68vh', width: '100%' }}
      showNavigator={true}
      showRefreshButton={true}
      showOpenInCodeSandbox={false}
    />
  );
}

export default SandpackPreviewClient;

