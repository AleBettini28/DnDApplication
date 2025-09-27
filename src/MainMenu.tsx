import {
  type BaseSyntheticEvent,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

function MainMenu(){

    //navigate
    const navigate = useNavigate();
    
    const [category, setCategory] = useState('spells')
    const [item, setItem] = useState('')

    const [success, setSuccess] = useState(false)
    const [sideSuccess, setSideSuccess] = useState(false)

    function handleItemChange(e: BaseSyntheticEvent){
        setItem(e.target.value)
    }

    function handleCategoryChange(e: BaseSyntheticEvent){
        setCategory(e.target.value)
    }

    const [result, setResult] = useState()
    const [sideResult, setSideResult] = useState()

    const [sideLabel, setSideLabel] = useState('')

    const prefix = "https://www.dnd5eapi.co";

    //UI RELATED FUNCTIONSW
    function closeSideContent(){
        //closes side content
        setSideSuccess(false)
    }

    //CALL TO API
    function fetchContent(){
            fetch(`https://www.dnd5eapi.co/api/${category}/${item}`)
                .then((res) => res.json())
                .then((data) => {
                    setResult(data)
                    setSuccess(true)
                    setSideSuccess(false)
                    console.log(data);
                })
                .catch((error) => {
                    setSuccess(false)
                    console.error('Error fetching data:', error);
                });
        };
    
    function fetchSideContent(label: string){
        fetch(`https://www.dnd5eapi.co${label}`)
            .then((res) => res.json())
            .then((data) => {
                setSideResult(data)
                setSideSuccess(true)
                setSideLabel(label)
                console.log(data);
            })
            .catch((error) => {
                setSideSuccess(false)
                console.error('Error fetching data:', error);
            });
    };

    let resultContent;

    if (success) {
    resultContent = (
            <div className='container'>
                <div className="result-showcase">
                    <h2>{result.name}</h2>
                    <JSONViewer data={result} link={`/api/2014/${category}/${item}`}/>
                    <img src={prefix + result.image} alt={result.name} />
                </div>

                {sideSuccess && (
                    <div className="side-div">
                        <h2>{sideResult.name}</h2>
                        <button className='top-right-button' onClick={() => {
                            closeSideContent()
                        }}>X</button>
                        <JSONViewer data={sideResult} link={sideLabel}/>
                        <img src={prefix + sideResult.image} alt={sideResult.name} />
                    </div>
                )}
            </div>
        );
    } else {
        resultContent = (
            <>
                <p className='custom-error'> INPUT WAS EITHER WRONG OR NULL </p>
                <br></br>
                <p className='custom-error'> INSERT A CORRECT INPUT TO SEARCH SUCCESSFULLY </p>
            </>
        )
    };

    return (
        <>

            <div className='top-button-bar'>
                <button className='dnd-button' onClick={() => {
                    navigate("/")
                }}>D&D Wiki</button>
                <button className='dnd-button'onClick={() => {
                    navigate("/character-builder")
                }}>Character Builder</button>
                <button className='dnd-button'onClick={() => {
                    navigate("/note-taker")
                }}>Notes</button>
            </div>
            <div className='top-banner'>
                <h1>D&D Wiki</h1>
                <form onSubmit={e => {
                    e.preventDefault(); // Prevents page reload
                    fetchContent()
                }}>
                    <select className='dnd-input' name="category" id="category" onChange={handleCategoryChange}>
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
                    <input className='dnd-input' type="text" autoFocus name="search" id="search" required onChange={handleItemChange}></input>
                    <br></br>
                    <br></br>
                    <button className='dnd-button'>Search</button>
                </form>
            </div>
            <br></br>
            <br></br>
            <br></br>
            
            {resultContent}
        </>
    );

type JSONViewerProps = {
  readonly data: any;
  readonly link: string;
};

function JSONViewer({ data, link }: JSONViewerProps) {
  if (typeof data === 'object' && data !== null) {
    return (
      <ul>
        {Object.entries(data).map(([key, value]) => {
            if(key === 'url' && value !== link){
                return (
                    <li key={key}>
                        <strong>{key}:</strong>
                        <button className='link-button' onClick={() => {
                            fetchSideContent(String(value))
                        }}>
                            {String(value)}
                        </button>
                    </li>
                )
            } else {
                return (
                    <li key={key}>
                        <strong>{key}:</strong> <JSONViewer data={value} link =''/>
                    </li>
                )
            };
        })}
      </ul>
    )
  } else {
    return <span>{String(data)}</span>;
  }
}

}

export default MainMenu

/*
TO DO
    Notes Page:
    A page with a big input field where the player can take notes during the session
    When clicking enter or confirm the note will be saved in a string and showed in the left side of the screen
*/