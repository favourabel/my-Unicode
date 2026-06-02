import { useParams } from "react-router-dom";

const students = [
  {
    id: 1,
    name: "John Doe",
    email: "john@gmail.com",
    nationality: "Nigeria",
    dob: "2003-05-12",
    address: "Lagos, Nigeria",
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@gmail.com",
    nationality: "Ghana",
    dob: "2002-10-20",
    address: "Accra, Ghana",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@gmail.com",
    nationality: "Kenya",
    dob: "2001-09-15",
    address: "Nairobi, Kenya",
  },
];

export default function Details() {
  const { id } = useParams();

  const student = students.find((s) => s.id == id);

  if (!student) {
    return <h2 style={{ padding: "20px" }}>Student not found</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Details</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "5px",
          width: "300px",
        }}
      >
        <p><b>Name:</b> {student.name}</p>
        <p><b>Email:</b> {student.email}</p>
        <p><b>Nationality:</b> {student.nationality}</p>
        <p><b>Date of Birth:</b> {student.dob}</p>
        <p><b>Address:</b> {student.address}</p>
      </div>
    </div>
  );
}