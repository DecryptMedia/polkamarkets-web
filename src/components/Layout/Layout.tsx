import { Container } from 'ui';

import BetaWarning from '../BetaWarning';
import Footer from '../Footer';
import Header from '../Header';
import RightSidebar from '../RightSidebar';
import ScrollableArea from '../ScrollableArea';

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="pm-l-layout">
      <BetaWarning />
      <Header />
      <ScrollableArea className="pm-l-layout__scrollable-area">
        <Container className="pm-l-layout__main">{children}</Container>
        <footer className="pm-l-layout__footer">
          <Footer />
        </footer>
      </ScrollableArea>
      <RightSidebar />
      <div id="toast-notification-portal" />
    </div>
  );
}
