import { ChatContainer } from './components/ChatContainer';

function App() {
  return (
    <ChatContainer
      useMock={true}
      userId="demo_user_001"
      enablePersistence={true}
    />
  );
}

export default App;
