import { Routes  , Route } from "react-router-dom";
import UploadFile from "./pages/FileUpload";
import Insights from "./pages/Insights";
const App = () => {
  return (
    <div className="scrollbar-hidden">
    <Routes>
      <Route path="/" element={<UploadFile/>} />
      <Route path="/your-data-insights" element={<Insights/>} />
    </Routes>
    </div>
  );
};

export default App;
