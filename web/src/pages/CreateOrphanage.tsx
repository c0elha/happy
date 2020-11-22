import React, { ChangeEvent, FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import { Map, Marker, TileLayer } from "react-leaflet";
import { FiPlus, FiX } from "react-icons/fi";
import { LeafletMouseEvent } from "leaflet";

import api from "../services/api";

import Sidebar from "../components/SideBar";
import mapIcon from "../utils/mapIcon";

import "../styles/pages/create-orphanage.css";
import { error } from "console";

interface PreviewImage {
  name: string;
  url: string;
}

interface OrphanageErrors {
  name: Array<string>;
  about: Array<string>;
  whatsapp: Array<string>;
  instructions: Array<string>;
  opening_hours: Array<string>;
  open_on_weekends: Array<string>;
  images: Array<string>;
  latitude: Array<string>;
  longitude: Array<string>;
}

export default function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instructions, setInstructions] = useState("");
  const [opening_hours, setOpeningHours] = useState("");
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);

  const [errors, setErrors] = useState<OrphanageErrors>();

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng,
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { latitude, longitude } = position;

    const data = new FormData();
    
    data.append("name", name);
    data.append("about", about);
    data.append("whatsapp", whatsapp);
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));
    data.append("instructions", instructions);
    data.append("opening_hours", opening_hours);
    data.append("open_on_weekends", String(open_on_weekends));

    images.forEach((image) => {
      data.append("images", image);
    });

    await api
      .post("/orphanages", data)
      .then((res) => {
        alert("Orfanato cadastrado com sucesso!");

        history.push("/app");
      })
      .catch((error) => {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data.errors);
          setErrors(error.response.data.errors);
        } else if (error.request) {
          // The request was made but no response was received
          console.error(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error", error.message);
        }
      });
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }
    const selectedImages = Array.from(event.target.files);

    event.target.value = "";

    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map((image) => {
      return { name: image.name, url: URL.createObjectURL(image) };
    });

    setPreviewImages(selectedImagesPreview);
  }

  function handleRemoveImage(image: PreviewImage) {
    setPreviewImages(
      previewImages.map((image) => image).filter((img) => img.url !== image.url)
    );
    setImages(
      images.map((image) => image).filter((img) => img.name !== image.name)
    );
  }

  function getErrorFirst(error: any) {
    let message = error[0].replace(/[^a-z0-9]/gi,' ')
    return message.charAt(0).toUpperCase() + message.slice(1);
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[-21.672495, -49.7501887]}
              style={{ width: "100%", height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {position.latitude !== 0 && (
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude, position.longitude]}
                />
              )}
            </Map>
              
            {(position.latitude == 0 || position.longitude == 0) && (
              <small className="text-error-map">Choose a position on the map</small>
            )}
            {(errors && errors.latitude) && (
              <small className="text-error">
                {getErrorFirst(errors.latitude)}
              </small>
            )}
            {errors && errors.longitude && (
              <small className="text-error">
                {getErrorFirst(errors.longitude)}
              </small>
            )}

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              {errors && errors.name && (
                <small className="text-error">
                  {getErrorFirst(errors.name)}
                </small>
              )}
            </div>

            <div className="input-block">
              <label htmlFor="about">
                Sobre <span>Máximo de 300 caracteres</span>
              </label>
              <textarea
                id="name"
                maxLength={300}
                value={about}
                onChange={(event) => setAbout(event.target.value)}
              />
              {errors && errors.about && (
                <small className="text-error">
                  {getErrorFirst(errors.about)}
                </small>
              )}
            </div>

            <div className="input-block">
              <label htmlFor="whatsapp">Número de Whatsapp</label>
              <input
                id="whatsapp"
                value={whatsapp}
                onChange={(event) => setWhatsapp(event.target.value)}
              />
              {errors && errors.whatsapp && (
                <small className="text-error">
                  {getErrorFirst(errors.whatsapp)}
                </small>
              )}
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map((image) => {
                  return (
                    <div key={image.url}>
                      <span
                        className="remove-image"
                        onClick={() => handleRemoveImage(image)}
                      >
                        <FiX size={18} color="#ff669d" />
                      </span>
                      <img src={image.url} alt={name} className="added-image" />
                    </div>
                  );
                })}

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input
                type="file"
                multiple
                accept=".png, .jpg, .jpeg"
                onChange={handleSelectImages}
                id="image[]"
              />
              {errors && errors.images && (
                <small className="text-error">
                  {getErrorFirst(errors.images)}
                </small>
              )}
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
              />
              {errors && errors.instructions && (
                <small className="text-error">
                  {getErrorFirst(errors.instructions)}
                </small>
              )}
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de Funcionamento</label>
              <input
                id="opening_hours"
                value={opening_hours}
                onChange={(event) => setOpeningHours(event.target.value)}
              />
              {errors && errors.opening_hours && (
                <small className="text-error">
                  {getErrorFirst(errors.opening_hours)}
                </small>
              )}
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={open_on_weekends ? "active" : ""}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={!open_on_weekends ? "active" : ""}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
              {errors && errors.open_on_weekends && (
                <small className="text-error">
                  {getErrorFirst(errors.open_on_weekends)}
                </small>
              )}
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}
