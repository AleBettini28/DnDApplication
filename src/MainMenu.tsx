import {
  type BaseSyntheticEvent,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

// ---- Types ----
type APIResult = {
  name: string;
  image?: string;
  url?: string;
  [key: string]: any;
};

type JSONViewerProps = {
  readonly data: any;
  readonly link: string;
  onSideFetch: (url: string) => void;
};

// ---- JSON Viewer Component ----
function JSONViewer({ data, link, onSideFetch }: JSONViewerProps) {
  if (typeof data === "object" && data !== null) {
    return (
      <ul>
        {Object.entries(data).map(([key, value]) => {
          if (key === "url" && value !== link) {
            return (
              <li key={key}>
                <strong>{key}:</strong>
                <button
                  className="link-button"
                  onClick={() => onSideFetch(String(value))}
                >
                  {String(value)}
                </button>
              </li>
            );
          } else {
            return (
              <li key={key}>
                <strong>{key}:</strong>{" "}
                <JSONViewer data={value} link="" onSideFetch={onSideFetch} />
              </li>
            );
          }
        })}
      </ul>
    );
  } else {
    return <span>{String(data)}</span>;
  }
}

// ---- Main Component ----
function MainMenu() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("spells");
  const [item, setItem] = useState("");

  const [success, setSuccess] = useState(false);
  const [sideSuccess, setSideSuccess] = useState(false);

  const [result, setResult] = useState<APIResult | null>(null);
  const [sideResult, setSideResult] = useState<APIResult | null>(null);

  const [sideLabel, setSideLabel] = useState("");

  const prefix = "https://www.dnd5eapi.co";

  // ---- UI Helpers ----
  function closeSideContent() {
    setSideSuccess(false);
    setSideResult(null);
  }

  // ---- API Calls ----
  function fetchContent() {
    fetch(`https://www.dnd5eapi.co/api/${category}/${item}`)
      .then((res) => res.json())
      .then((data: APIResult) => {
        setResult(data);
        setSuccess(true);
        setSideSuccess(false);
        console.log(data);
      })
      .catch((error) => {
        setSuccess(false);
        console.error("Error fetching data:", error);
      });
  }

  function fetchSideContent(label: string) {
    fetch(`https://www.dnd5eapi.co${label}`)
      .then((res) => res.json())
      .then((data: APIResult) => {
        setSideResult(data);
        setSideSuccess(true);
        setSideLabel(label);
        console.log(data);
      })
      .catch((error) => {
        setSideSuccess(false);
        console.error("Error fetching data:", error);
      });
  }

  // ---- Result Content ----
  let resultContent;

  if (success && result) {
    resultContent = (
      <div className="container">
        <div className="result-showcase">
          <h2>{result.name}</h2>
          <JSONViewer
            data={result}
            link={`/api/2014/${category}/${item}`}
            onSideFetch={fetchSideContent}
          />
          {result.image && (
            <img src={prefix + result.image} alt={result.name} />
          )}
        </div>

        {sideSuccess && sideResult && (
          <div className="side-div">
            <h2>{sideResult.name}</h2>
            <button
              className="top-right-button"
              onClick={closeSideContent}
            >
              X
            </button>
            <JSONViewer
              data={sideResult}
              link={sideLabel}
              onSideFetch={fetchSideContent}
            />
            {sideResult.image && (
              <img src={prefix + sideResult.image} alt={sideResult.name} />
            )}
          </div>
        )}
      </div>
    );
  } else {
    resultContent = (
      <>
        <p className="custom-error">INPUT WAS EITHER WRONG OR NULL</p>
        <br />
        <p className="custom-error">
          INSERT A CORRECT INPUT TO SEARCH SUCCESSFULLY
        </p>
      </>
    );
  }

  // ---- Render ----
  return (
    <>
      {/* Top Navigation */}
      <div className="top-button-bar">
        <button
          className="dnd-button"
          onClick={() => {
            navigate("/");
          }}
        >
          D&D Wiki
        </button>
        <button
          className="dnd-button"
          onClick={() => {
            navigate("/character-builder");
          }}
        >
          Character Builder
        </button>
        <button
          className="dnd-button"
          onClick={() => {
            navigate("/note-taker");
          }}
        >
          Notes
        </button>
      </div>

      {/* Search Form */}
      <div className="top-banner">
        <h1>D&D Wiki</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchContent();
          }}
        >
          <select
            className="dnd-input"
            name="category"
            id="category"
            onChange={(e: BaseSyntheticEvent) => setCategory(e.target.value)}
          >
            <option value="spells">Spells</option>
            <option value="classes">Classes</option>
            <option value="races">Races</option>
            <option value="subclasses">Subclasses</option>
            <option value="subraces">Subraces</option>
            <option value="monsters">Monsters</option>
            <option value="equipment">Equipment</option>
            <option value="languages">Languages</option>
            <option value="magic-items">Magic Items</option>
            <option value="ability-scores">Ability Scores</option>
            <option value="skills">Skills</option>
            <option value="traits">Traits</option>
            <option value="conditions">Conditions</option>
            <option value="alignments">Alignments</option>
            <option value="backgrounds">Backgrounds</option>
            <option value="damage-types">Damage Types</option>
            <option value="equipment-categories">Equipment Categories</option>
            <option value="feats">Feats</option>
            <option value="features">Features</option>
            <option value="magic-schools">Magic Schools</option>
            <option value="proficiencies">Proficiencies</option>
            <option value="weapon-properties">Weapon Properties</option>
            <option value="rules">Rules</option>
            <option value="rule-sections">Rule Sections</option>
          </select>

          <input
            className="dnd-input"
            type="text"
            autoFocus
            name="search"
            id="search"
            required
            onChange={(e: BaseSyntheticEvent) => setItem(e.target.value)}
          />
          <br />
          <br />
          <button className="dnd-button">Search</button>
        </form>
      </div>

      <br />
      <br />
      <br />

      {resultContent}
    </>
  );
}

export default MainMenu;
