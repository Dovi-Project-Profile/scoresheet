import PropTypes from "prop-types";

export const TeamList = ({ playersList, closeModal }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={closeModal}>
          &times;
        </button>
        <h2>Team {playersList[0]?.tbl_local_team.team_name}</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Jersey No.</th>
              <th>Position</th>
              <th>Height cm</th>
              <th>Weight kg</th>
              <th>Age</th>
              <th>Birthdate</th>
              <th>Hometown</th>
            </tr>
          </thead>
          <tbody>
            {playersList.map((p, index) => (
              <tr key={1 + index}>
                <td>{p.first_name + " " + p.last_name}</td>
                <td>{p.jersey_number}</td>
                <td>{p.position}</td>
                <td>{p.height_cm}</td>
                <td>{p.weight_kg}</td>
                <td>{p.age}</td>
                <td>{p.birthdate}</td>
                <td>{p.hometown}</td>
              </tr>
            ))}
            {!playersList.length && (
              <tr style={{ fontWeight: "bolder" }}>
                <td colSpan="8">
                  <i>No Data</i>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

TeamList.propTypes = {
  playersList: PropTypes.array.isRequired,
  closeModal: PropTypes.func.isRequired,
};
