import { Helmet } from '@modern-js/runtime/head';
import { VarEditorTable } from '../../components/VarEditorTable';
import './index.less';

const VarEditorTablePage = () => (
  <div className="var-editor-container">
    <Helmet>
      <link
        rel="icon"
        type="image/x-icon"
        href="https://lf3-static.bytednsdoc.com/obj/eden-cn/uhbfnupenuhf/favicon.ico"
      />
    </Helmet>
    <header className="var-editor-header">
      <div className="header-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12h6M9 16h6" />
        </svg>
      </div>
      <div className="header-content">
        <p>Variable Table Editor</p>
      </div>
    </header>
    <main className="var-editor-main">
      <VarEditorTable />
    </main>
    <footer className="var-editor-footer">
      <span>Siemens TIA Portal</span>
      <span className="separator">|</span>
      <span>Variable Management System</span>
    </footer>
  </div>
);

export default VarEditorTablePage;
