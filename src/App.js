import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Login from "./pages/Public/Login/Login";
import Dashboard from "./pages/Main/Dashboard/Dashboard";
import Main from "./pages/Main/Main";
import Movie from "./pages/Main/Movie/Movie";
import Lists from "./pages/Main/Movie/Lists/Lists";
import Form from "./pages/Main/Movie/Form/Form";
import Register from "./pages/Public/Register/Register";
import MainClient from "./Clientpages/Main/MainClient";
import Home from "./Clientpages/Main/Movie/Home/Home";
import View from "./Clientpages/Main/Movie/View/View";
import MovieContextProvider from "./context/MovieContext";
import MovieVideo from "./components/MovieVideos/MovieVideo";
import MoviePhotos from "./components/MoviePhotos/MoviePhotos";
import MovieCasts from "./components/MovieCasts/MovieCasts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainClient />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/view/:movieId?",
        element: <View />,
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/main",
    element: <Main />,
    children: [
      //Temporarily disabled the dashboard route
      // {
      //   path: '/main/dashboard',
      //   element: <Dashboard />,
      // },
      {
        path: "/main/movies",
        element: <Movie />,
        children: [
          {
            path: "/main/movies",
            element: <Lists />,
          },
          {
            path: "/main/movies/form/:movieId?",
            element: <Form />,
            children: [
              {
                path: "/main/movies/form/:movieId",
                element: (
                  <MovieCasts/>
                ),
              },
              {
                path: "/main/movies/form/:movieId/cast-and-crews",
                element: (
              <MovieCasts/>
                ),
              },
              {
                path: "/main/movies/form/:movieId/photos",
                element: (
                  <MoviePhotos/>
                ),
              },
              {
                path: "/main/movies/form/:movieId/videos",
                element: (
                  <MovieVideo />
                ),
              },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <MovieContextProvider>
        <RouterProvider router={router} />
      </MovieContextProvider>
    </div>
  );
}

export default App;
