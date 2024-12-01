import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import { ChatProvider } from './contexts/ChatContext';
import { AudioFileProvider } from './contexts/AudioFileContext';
import GroupPage from './pages/GroupsPage';
import MembersPage from './pages/MembersPage';
import LogoutPage from './pages/LogoutPage';
import { useCookies } from 'react-cookie';

setupIonicReact();

const App: React.FC = () => {

  return (
    <IonApp>
      <ChatProvider>
        <AudioFileProvider>
          <IonReactRouter>
            <IonSplitPane contentId="main">
              <Menu />
              <IonRouterOutlet id="main">
                <Route path="/Login" exact={true}>
                  <LoginPage />
                </Route>
                <Route path="/Logout" exact={true}>
                  <LogoutPage />
                </Route>
                <Route path="/Chat" exact={true}>
                  <ChatPage />
                </Route>
                <Route path="/Group" exact={true}>
                  <GroupPage />
                </Route>
                <Route path="/Members" exact={true}>
                  <MembersPage />
                </Route>
                <Route path="/" exact={true}>
                  <Redirect to="/folder/Inbox" />
                </Route>
                <Route path="/folder/:name" exact={true}>
                  <Page />
                </Route>
              </IonRouterOutlet>
            </IonSplitPane>
          </IonReactRouter>
        </AudioFileProvider>
      </ChatProvider>
    </IonApp>
  );
};

export default App;
