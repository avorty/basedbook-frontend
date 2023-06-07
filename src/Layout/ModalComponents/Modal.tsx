import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "react-bootstrap-icons";
import ReportModal from "./ReportModal";
import DeleteModal from "./DeleteModal";
import classes from "./Modal.module.css";
import ProjectAppliedUsersModal from "./ProjectAppliedUsersModal";
import LoadingSpinner from "../../Components/LoadingSpinner";
import FollowersModal from "./FollowersModal";
import FollowingModal from "./FollowingModal";
import SocialsModal from "./SocialsModal";
import AddPostModal from "./AddPostModal";
import AddProjectModal from "./AddProjectModal";
import RemoveAccountModal from "./RemoveAccountModal";
import TotpModal from "./TotpModal";
import Enable2FAModal from "./Enable2FAModal";

const Modal = (props: any) => {
  const [isLoading, setIsLoading] = useState(true);

  const showSpinner = (value: any) => {
    setIsLoading(value);
  };

  const modal = document.getElementById("modal")!;
  const backdrop = document.getElementById("backdrop")!;

  return (
    <>
      {createPortal(
        <div className={classes.background} onClick={props.onBgClick}></div>,
        backdrop
      )}
      {createPortal(
        <div className={classes.modal}>
          <p onClick={props.onBgClick} className={classes.closeModal}>
            <X />
          </p>
          {props.modalContent === "report" && (
            <ReportModal
              postId={props.postId}
              projectId={props.projectId}
              onClose={props.onClose}
              showSpinner={showSpinner}
            />
          )}
          {props.modalContent === "totp" && (
              <TotpModal onClose={props.onClose} showSpinner={showSpinner} />
            )}
          {props.modalContent === "enable2FA" && (
              <Enable2FAModal onClose={props.onClose} showSpinner={showSpinner} />
          )}
          {props.modalContent === "projectAppliedUsers" && (
            <ProjectAppliedUsersModal
              postId={props.postId}
              projectId={props.projectId}
              showSpinner={showSpinner}
              onClose={props.onClose}
            />
          )}
          {props.modalContent === "delete" && (
            <DeleteModal
              postId={props.postId || null}
              projectId={props.projectId || null}
              onClose={props.onClose}
              showSpinner={showSpinner}
            />
          )}
          {props.modalContent === "followers" && (
            <FollowersModal
              userId={props.userId}
              onClose={props.onClose}
              showSpinner={showSpinner}
            />
          )}
          {props.modalContent === "following" && (
            <FollowingModal
              userId={props.userId}
              onClose={props.onClose}
              showSpinner={showSpinner}
            />
          )}
          {props.modalContent === "socials" && (
            <SocialsModal
              userId={props.userId}
              onClose={props.onClose}
              showSpinner={showSpinner}
            />
          )}
          {props.modalContent === "addpost" && (
            <AddPostModal onClose={props.onClose} showSpinner={showSpinner} />
          )}
          {props.modalContent === "addproject" && (
            <AddProjectModal
              onClose={props.onClose}
              showSpinner={showSpinner}
            />
          )}
          {props.modalContent === "removeaccount" && (
            <RemoveAccountModal
              onClose={props.onClose}
              showSpinner={showSpinner}
            />
          )}
          {isLoading && <LoadingSpinner height="100%" />}
        </div>,
        modal
      )}
    </>
  );
};

export default Modal;
