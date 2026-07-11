import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { url } from "../utils";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useSelector((state) => state.LoginReducer);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?._id) return;

    const s = io(url);
    socketRef.current = s;
    s.emit("setup", user);
    s.on("connected", () => setSocketConnected(true));

    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocketConnected(false);
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socketRef, socketConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Returns the single shared socket for this session, plus a connected flag.
// socketRef.current may briefly be null right after mount/user change;
// always guard with optional chaining (socketRef.current?.emit(...)).
export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return ctx;
};
