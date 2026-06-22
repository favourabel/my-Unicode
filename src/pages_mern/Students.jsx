import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const loadStudents = () => {
      const users =
        JSON.parse(localStorage.getItem("users")) || [];

      setStudents(users);
    };

    // Initial Load
    loadStudents();

    // Auto Refresh Every Second
    const interval = setInterval(() => {
      loadStudents();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Students List</h2>

      {students.length > 0 ? (
        students.map((student, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <h3>
              {student.firstName} {student.lastName}
            </h3>

            <p>{student.email}</p>

            <p>
              {student.nationality || "Nationality Not Added"}
            </p>

            <button
              onClick={() =>
                navigate(`/details/${index}`)
              }
              style={{
                padding: "5px 10px",
                background: "blue",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              View Details
            </button>
          </div>
        ))
      ) : (
        <p>No students registered yet.</p>
      )}
    </div>
  );
}