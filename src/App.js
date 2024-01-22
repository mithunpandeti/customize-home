import Header from "./components/Header";
import Home from "./components/Home";
import Kitchen from "./components/Kitchen";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Living from "./components/Living";
import Bedroom from "./components/Bedroom";
import Washroom from "./components/Washroom";
import Footer from "./components/Footer";
import ErrorPage from "./components/ErrorPage";
import Login from "./components/Login";
import appStore from "./utils/appStore";
import { Provider } from "react-redux";
import People from "./components/People";

function App() {

  const HeaderLayout = () => (
    <>
    <Provider store={appStore}>
      <Header />
      <Outlet />
      <Footer />
      </Provider>
    </>
  );

  const router = createBrowserRouter([
    {
      element: <HeaderLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Login />,
        },
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: '/kitchen',
          element: <Kitchen />,
        },
        {
          path: '/living',
          element: <Living />,
        },
        {
          path: '/bedroom',
          element: <Bedroom />,
        },
        {
          path: '/washroom',
          element: <Washroom />,
        },
        {
          path: '/people',
          element: <People />,
        }
      ],
    },
  ]);

  
  
  return (
    <div className="App mt-4 mb-4">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
