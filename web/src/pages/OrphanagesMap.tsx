import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiArrowRight } from "react-icons/fi";
import { Map, TileLayer, Marker, Popup } from "react-leaflet"; //🎯 instalado com: yarn add leaflet react-leaflet

import iconSideBar from "../images/map-marker.svg";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";

import "../styles/pages/orphanages-map.css";

interface Orphanage {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  useEffect(() => {
    api.get("/orphanages").then((resp) => {
      setOrphanages(resp.data);
    });
  }, []);

  return (
    <div id="page-map">
      <aside>
        <header>
          <Link to="/">
            <img
              title="Voltar para a página principal"
              src={iconSideBar}
              alt="Happy"
            />
          </Link>

          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>

        <footer>
          <strong>Lins</strong>
          <span>São Paulo</span>
        </footer>
      </aside>

      <Map
        center={[-21.672495, -49.7501887]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
      >
        {/*<TileLayer url="https://a.title.openstreetmap.org/{z}/{x}/{y}.png" />*/}

        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
        />

        {orphanages.map((orphanage) => {
          return (
            <Marker
              title="Clique para mais detalhes"
              key={orphanage.id}
              icon={mapIcon}
              position={[orphanage.latitude, orphanage.longitude]}
            >
              <Popup
                closeButton={false}
                minWidth={240}
                maxWidth={240}
                className="map-popup"
              >
                {orphanage.name}
                <Link
                  title={
                    "CLique para ver mais\ninformações sobre:\n" +
                    orphanage.name
                  }
                  to={`/orphanages/${orphanage.id}`}
                >
                  <FiArrowRight size={20} color="#fff" />
                </Link>
              </Popup>
            </Marker>
          );
        })}
      </Map>

      <Link
        title="Cadastrar um orfanato"
        to="/orphanages/create"
        className="create-orphanage"
      >
        <FiPlus size={32} color="#fff" />
      </Link>
    </div>
  );
}

export default OrphanagesMap;
