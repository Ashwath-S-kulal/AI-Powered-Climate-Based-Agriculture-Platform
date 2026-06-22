import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css"
import Dashboard from "./Pages/Dashboard";
import Home from "./Pages/Home"
import Weather from './Pages/Weather'
import Disease from './Pages/Disease';
import SoilAnalytics from './Pages/SoilAnalytics';
import About from './Pages/About';
import SignIn from './Pages/SignIn';
import Profile from './Pages/Profile';
import PrivateRoute from './Components/PrivateRoute';
import CropsList from './Pages/CropList';
import AccessPage from './Components/AccessPage';
import CropRecomnder from './Pages/CropRecomnder';
import CropInfo from './Pages/CropInfo';
import CropRiskCalculater from './Pages/CropRiskCalculater';
import Tips from "./Pages/ClimateResilientIdeas/Tips"
import ScrollToTop from './Components/ScrollToTop';
import DiseaseData from "./Pages/DiseaseData"
import DiseaseSuppliment from "./Pages/DiseaseSuppliment"
import CropsLibrary from "./Pages/CropsLibrary"
import Stratergies from "./Pages/ClimateResilientIdeas/Practices"
import Adaptation from "./Pages/ClimateResilientIdeas/Adaptation"
import AdminRoute from './Components/AdminRoute';
import AdminDashboard from './Pages/AdminDashboard';
import Breadcrumbs from "./Components/Breadcrumbs";
import ChatbotIcon from "./Components/ChatbotIcon";
import GeoIntelligencePage from './Pages/GeoIntelligence';


export default function App() {
  return (
    <div>
      <BrowserRouter>
        <ScrollToTop />
        <Breadcrumbs />
        <ChatbotIcon />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/accesspage' element={<AccessPage />} />
          <Route path='/croplibrary' element={<CropsLibrary />} />
          <Route path="/croplibrary/croplist" element={<CropsList />} />
          <Route path='/croplibrary/cropinfo' element={<CropInfo />} />
          <Route path='/croplibrary/diseasedata' element={<DiseaseData />} />
          <Route path='/croplibrary/stratergies' element={<Stratergies />} />
          <Route path='/croplibrary/adaptation' element={<Adaptation />} />
          <Route path='/croplibrary/tips' element={<Tips />} />
          <Route path='/disease/diseasesuppliment' element={<DiseaseSuppliment />} />
          <Route path='/geointelligence' element={<GeoIntelligencePage />} />
          <Route path='/weather' element={<Weather />} />

          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path='/disease' element={<Disease />} />
            <Route path='/soil' element={<SoilAnalytics />} />
            <Route path='/croprecomnder' element={<CropRecomnder />} />
            <Route path='/cropriskcalculater' element={<CropRiskCalculater />} />
          </Route>


          <Route element={<AdminRoute />}>
            <Route path='/profile/adminpanel' element={<AdminDashboard />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  )
}