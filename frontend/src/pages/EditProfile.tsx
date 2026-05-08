import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/edit-craftsman-profile", { replace: true });
  }, [navigate]);

  return null;
}
