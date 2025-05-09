import React, {
  useRef,
  createContext,
  useState,
  useCallback,
  useEffect
} from "react";
import PropTypes from "prop-types";

import PopupNotification from "components/PopupNotification/PopupNotification.js";

import MESSAGES from "constants/notificationMessages";
import axiosInstance from "../config/axiosInstance";

const Context = createContext(null);

export const ContextProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("success");
  const notificationRef = useRef(null);
  const getPlaylists = useCallback(() => {
        axiosInstance
            .get("/playlists/accessible-list?limit=1000")
            .then(res => setPlaylists(res?.data?.data))
            .catch(error => {
                setMessageStatus("danger");
                setMessage(
                    error?.response?.data?.message || MESSAGES.couldntReadFromError
                );
                return notificationRef?.current?.showNotification();
            });
    }, []);
  const getProjects = useCallback(() => {
    axiosInstance
      .get("/projects/accessible-list?limit=1000")
      .then(res => setProjects(res?.data?.data))
      .catch(error => {
        setMessageStatus("danger");
        setMessage(
          error?.response?.data?.message || MESSAGES.couldntReadFromError
        );
        return notificationRef?.current?.showNotification();
      });
  }, []);
  const getCompanies = useCallback(() => {
    axiosInstance
      .get("/companies/accessible-list?limit=1000")
      .then(res => setCompanies(res?.data?.data))
      .catch(error => {
        setMessageStatus("danger");
        setMessage(
          error?.response?.data?.message || MESSAGES.couldntReadFromError
        );
        return notificationRef?.current?.showNotification();
      });
  }, []);

  useEffect(() => {
    getProjects();
    getCompanies();
    getPlaylists();
  }, []);

  return (
    <Context.Provider value={{ projects, getProjects, playlists, getPlaylists, companies, getCompanies}}>
      {children}
      <PopupNotification
        ref={notificationRef}
        status={messageStatus}
        message={message}
      />
    </Context.Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.any
};

export default Context;
