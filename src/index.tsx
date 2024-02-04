import { createRoot } from 'react-dom/client';
import Root from './Root';

import './styles/index.scss';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Root />);
