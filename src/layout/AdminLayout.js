import TheContent from "./components/Content";
import TheFooter from "./components/Footer";
import TheHeader from "./components/Headers";
import TheSidebar from "./components/Sidebar";

const AdminLayout = () => {
  return (
    <div>
      <TheSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <TheHeader className="bg-white" />
        <div className="body flex-grow-1 px-3 bg-white">
          <TheContent />
        </div>
        <TheFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
