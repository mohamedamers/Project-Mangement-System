

import { useAuth } from "../../../../Context/AuthContext";


export default function Profile() {
  let { currentUser  } = useAuth()!;
  if (!currentUser) {
    return (
      <div className="d-flex justify-content-center align-items-center ">
        <i className="fa fa-spinner fa-spin fa-3x text-muted" />
      </div>
    );
  }

  return (
   <>
   <div className="container ">
        <div className="row justify-content-center ">
          <div className="col-md-7 col-lg-6  py-3">
            <div className="card shadow border-0 rounded-4 p-lg-4">
              <div className="card-body p-4 text-center">
                <div className="mb-4">
                  <img
                    src={`${"https://upskilling-egypt.com:3003/"}/${currentUser?.imagePath}`}
                    alt="User"
                    className="rounded-circle shadow imgEnhanceUser"
                    width="130"
                    height="130"
                  />
                </div>
                <h4 className="fw-bold text-primary mb-1">
                  {currentUser?.userName}
                </h4>
                <p className="text-muted mb-3">{currentUser?.email}</p>

                <ul className="list-group text-start mb-4">
                  
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>UserName</strong>{" "}
                    <span>{currentUser?.userName}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Phone</strong>{" "}
                    <span>{currentUser?.phoneNumber || "N/A"}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Country</strong> <span>{currentUser?.country}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Role</strong>{" "}
                    <span>{currentUser?.group?.name}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Status</strong>{" "}
                    <span
                      className={`badge ${
                        currentUser?.isActivated ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {currentUser?.isActivated ? "Activated" : "Inactive"}
                    </span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Joined At</strong>{" "}
                    <span>
                      {new Date(currentUser?.creationDate).toLocaleDateString()}
                    </span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Last Modified</strong>{" "}
                    <span>
                      {new Date(
                        currentUser?.modificationDate
                      ).toLocaleDateString()}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
   </>
   )
}
