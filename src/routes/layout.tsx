import { Outlet } from '@modern-js/runtime/router';
import "@arco-design/web-react/dist/css/arco.css";

export default function Layout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
