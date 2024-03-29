import React, { ChangeEvent, useEffect, useState } from "react";
import classes from "./Settings.module.css";
import Section from "../../Layout/Section";
import Input from "../../Components/Input";
import Textarea from "../../Components/Textarea";
import Button from "../../Components/Button";
import getUserObject from "../../Lib/getUser";
import useDarkMode from "use-dark-mode";
import {
  BrightnessHighFill,
  MoonFill,
  PencilFill,
  CheckSquareFill,
} from "react-bootstrap-icons";
import LoadingSpinner from "../../Components/LoadingSpinner";
//@ts-ignore
import { NotificationManager } from "react-notifications";
import Modal from "../../Layout/ModalComponents/Modal";
import Avatar from "../../Components/Avatar";

const Settings = () => {
  const user = getUserObject();
  const darkMode = useDarkMode();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [avatar, setAvatar] = useState("");
  const [settings, setSettings] = useState({
    avatar: new Blob(),
    username: "",
    email: "",
    name: "",
    surname: "",
    facebook: "",
    instagram: "",
    youtube: "",
    website: "",
    profileDesc: "",
  });
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  async function getSettings() {
    setIsLoading(true);
    try {
      await fetch(`${process.env.REACT_APP_REQUEST_URL}/user/settings/get`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((json) =>
          JSON.parse(JSON.stringify(json).replace(/null/gi, '""'))
        )
        .then((data) => setSettings(data));
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }

  const updateTheme = () => {
    darkMode.toggle();
    return;
  };

  async function checkIf2FAEnabled() {
    await fetch(`${process.env.REACT_APP_REQUEST_URL}/auth/totp/is-enabled`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.is2faEnabled === true) {
          setIs2FAEnabled(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
  async function disable2FA() {
    await fetch(`${process.env.REACT_APP_REQUEST_URL}/auth/totp/remove`, {
      method: "PATCH",
      credentials: "include",
    })
      .then((response) => {
        console.log(response);
        if (response.status === 204) {
          setIs2FAEnabled(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
  async function updateSettings() {
    if (settings.username.length < 2) {
      NotificationManager.error(
        "Nazwa użytkownika nie może krótsza niż 2 znaki",
        "Błąd przy zapisywaniu ustawień",
        3000
      );
      return;
    }

    if (settings.website.length > 0) {
      try {
        new URL(settings.website);
      } catch (_) {
        NotificationManager.error(
          "Adres strony powinien być poprawnym adresem URL",
          "Błąd przy zapisywaniu ustawień",
          3000
          );
          return; 
      }
    }

    setIsLoading(true);
    const formData = new FormData();
    for (const name in settings)
      formData.append(name, settings[name as keyof typeof settings]);
    fetch(`${process.env.REACT_APP_REQUEST_URL}/user/settings/`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    })
      .then((res) => {
        res.ok
          ? NotificationManager.success(
              "Udało się zaktualizować ustawienia.",
              "Sukces!",
              3000
            )
          : NotificationManager.error(
              "Nie udało się zaktualizować ustawień.",
              "Błąd!",
              3000
            );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const handleUserNameChange = (event: any) => {
    setSettings({
      ...settings,
      username: event.target.value.trim(),
    });
  };
  const handleFacebookChange = (event: any) => {
    setSettings({
      ...settings,
      facebook: event.target.value.trim(),
    });
  };
  const handleInstagramChange = (event: any) => {
    setSettings({
      ...settings,
      instagram: event.target.value.trim(),
    });
  };
  const handleYTChange = (event: any) => {
    setSettings({
      ...settings,
      youtube: event.target.value.trim(),
    });
  };
  const handleWebsiteChange = (event: any) => {
    setSettings({
      ...settings,
      website: event.target.value.trim(),
    });
  };
  const handleDescChange = (event: any) => {
    setSettings({
      ...settings,
      profileDesc: event.target.value,
    });
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAvatar(URL.createObjectURL(event.target.files[0]));
      setSettings({
        ...settings,
        avatar: event.target.files[0],
      });
    }
  };
  useEffect(() => {
    getSettings();
    checkIf2FAEnabled();
  }, []);
  return (
    <>
      {!isLoading && (
        <>
          {showModal && (
            <Modal
              onClose={() => setShowModal(false)}
              modalContent="removeaccount"
              onBgClick={() => setShowModal(false)}
            />
          )}
          {show2FAModal && (
            <Modal
              modalContent="enable2FA"
              onClose={() => setShow2FAModal(false)}
              onBgClick={() => setShow2FAModal(false)}
            />
          )}
          <Section>
            <h2>Profil</h2>
            <div className={classes.twoInputs}>
              <Input
                placeholder="Nazwa użytkownika"
                value={settings.username}
                onChange={handleUserNameChange}
              />
              <Button buttonText="Zmień hasło" destination="/auth/reset" />
            </div>
            <div className={classes.twoInputs}>
              <Input
                placeholder="Nazwa użytkownika na facebooku"
                value={settings.facebook}
                onChange={handleFacebookChange}
              />
              <Input
                placeholder="Nazwa użytkownika na instagramie"
                value={settings.instagram}
                onChange={handleInstagramChange}
              />
            </div>
            <div className={classes.twoInputs}>
              <Input
                placeholder="Nazwa kanału na youtubie"
                value={settings.youtube}
                onChange={handleYTChange}
              />
              <Input
                placeholder="Link do strony internetowej"
                value={settings.website}
                onChange={handleWebsiteChange}
              />
            </div>
            <div className={classes.twoInputs}>
              <div className={classes.inputHolder}>
                <Textarea
                  placeholder="Opis profilu"
                  value={settings.profileDesc}
                  onChange={handleDescChange}
                />
              </div>
              <div className={classes.inputHolder}>
                <label htmlFor="avatarUploader" className={classes.avatar}>
                  <span className={`${classes.coverer} ${classes.hidden}`}>
                    <PencilFill className={classes.covererIcon} />
                  </span>
                  <Avatar userId={user.id} override={avatar} />
                </label>
              </div>
              <input
                type="file"
                id="avatarUploader"
                accept="image/jpeg"
                className={classes.invisible}
                onChange={handleAvatarChange}
              />
            </div>
          </Section>
          <Section>
            <h2>Preferencje</h2>
            <div className={classes.inliner}>
              <div className={classes.switchContainer} onClick={updateTheme}>
                <div className={classes.themeSwitch}>
                  <div
                    className={`${classes.ballWrapper} ${
                      darkMode.value ? classes.right : classes.left
                    }`}
                  >
                    <BrightnessHighFill
                      className={!darkMode.value ? classes.current : ""}
                    />
                    <MoonFill
                      className={darkMode.value ? classes.current : ""}
                    />
                  </div>
                </div>
                <label className={classes.label}>Ciemny motyw</label>
              </div>
              <div>
                {is2FAEnabled ? (
                  <Button
                    buttonText="Usuń weryfikację dwuetapową"
                    onClick={disable2FA}
                  />
                ) : (
                  <Button
                    buttonText="Dodaj weryfikację dwuetapową"
                    onClick={() => setShow2FAModal(true)}
                  />
                )}
              </div>
            </div>
          </Section>
          <Section>
            <h2>Konto</h2>
            <div className={classes.bottomButtons}>
              <Button
                buttonText="Usuń konto"
                className="alternate"
                onClick={() => setShowModal(true)}
              />
              <Button
                buttonText={
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      columnGap: ".3rem",
                    }}
                  >
                    Zapisz{" "}
                    <CheckSquareFill
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        paddingTop: ".4rem",
                      }}
                    />
                  </span>
                }
                onClick={updateSettings}
              />
            </div>
          </Section>
        </>
      )}
      {isLoading && <LoadingSpinner />}
    </>
  );
};

export default Settings;
