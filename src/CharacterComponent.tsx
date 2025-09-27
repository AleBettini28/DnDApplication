import {
  type BaseSyntheticEvent,
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

interface Character {
  name: string;
  playerName: string;
  level: string;
  class: string;
  race: string;
  alignment: string;
  statistics: {
    hp: string;
    ac: string;
    profBonus: string;
  };
  ability: {
    str: string;
    dex: string;
    con: string;
    int: string;
    wis: string;
    cha: string;
  };
  background: string
}

/* HOW DOES THIS WORK
    An interface is declared at the start, defining the type character and everything the character needs to exist
    In the Component there is a useState which contains the character created
    If the character is created or not is save in the created useState which is a boolean

    Then, in the form we take all the information and at change we call the function handleChange
    This function reads from the event the name  (id) of the input field that was compiled and the value inserted.
    It saves them in a temp const and set them into the character
        setCharacter((prev) => ({
            ...prev,
            [name]: value,
        }));
    this calls the setCharacter useState, takes the old value (prev) and creates a function that sets in the new values everything that was in the old one with ...prev
    plus the new value of the name (id) we passed in input

    Thanks to an useEffect the created character is saved in localStorage and loaded (if existing) at start:
        const [character, setCharacter] = useState<Character>(() => {
            const saved = localStorage.getItem("character");
            return saved ? JSON.parse(saved) : {
                id: '',
                name: '',
                playerName: '',
                level: '',
                class: '',
                race: '',
                alignment: '',
                statistics: { hp: '0', ac: '0', profBonus: '0' },
                ability: { str: '0', dex: '0', con: '0', int: '0', wis: '0', cha: '0' },
                /*proficiencies: [],
                languages: [],
                equipment: [],
                abilities: [],
            };
        });

        useEffect(() => {
            localStorage.setItem("created", JSON.stringify(created))
        }, [created])
    
*/
function CharacterComponent(){

    const navigate = useNavigate()
    
    const [character, setCharacter] = useState<Character>(() => {
        const saved = localStorage.getItem("character");
        return saved ? JSON.parse(saved) : {
            name: '',
            playerName: '',
            level: '',
            class: '',
            race: '',
            alignment: '',
            statistics: { hp: '0', ac: '0', profBonus: '0' },
            ability: { str: '0', dex: '0', con: '0', int: '0', wis: '0', cha: '0' },
            background: '',
        };
    });

    const [created, setCreated] = useState(() => {
        const saved = localStorage.getItem("created");
        return saved ? JSON.parse(saved) : false;
    })

    useEffect(() => {
        localStorage.setItem("created", JSON.stringify(created))
    }, [created])

    function handleChange(e: BaseSyntheticEvent) {
        const { name, value } = e.target;

        setCharacter((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleNestedChange(e: BaseSyntheticEvent) {
        const { name, value } = e.target;
        const [section, key] = name.split('.') as ["statistics" | "ability", string];

        setCharacter((prev) => ({
            ...prev,
            [section]: {
            ...prev[section as "statistics" | "ability"],
            [key]: value, // keep as string for consistency
            },
        }));
    }

    useEffect(() => {
        localStorage.setItem("character", JSON.stringify(character));
    }, [character]);

    function createCharacter(){
        setCreated(true);
        setIsCreating(false);
    }

    const [isCreating, setIsCreating] = useState(false);

    function StartCreation(){
        setIsCreating(true);
        setCreated(false);
    }

    let characterContent;

    if(created){
        characterContent = (
            <div className='top-banner'>
                <h1>Your Character</h1>
                <p><strong>Player:</strong> {character.playerName}</p>
                <p><strong>Name:</strong> {character.name}</p>
                <p><strong>Class:</strong> {character.class}</p>
                <p><strong>Race:</strong>  {character.race}</p>
                <p><strong>Level:</strong>  {character.level}</p>
                <p><strong>Alignment:</strong> {character.alignment}</p>
                <p><strong>STATISTICS:</strong></p>
                <p><strong>HP:</strong> {character.statistics.hp}</p>
                <p><strong>AC:</strong> {character.statistics.ac}</p>
                <p><strong>Proficiency Bonus:</strong> {character.statistics.profBonus}</p>
                <p><strong>ABILITIES SCORES:</strong></p>
                <strong> STR:</strong> {character.ability.str}&nbsp;&nbsp;&nbsp;
                <strong> DEX:</strong> {character.ability.dex}&nbsp;&nbsp;&nbsp;
                <strong> CON:</strong> {character.ability.con}&nbsp;&nbsp;&nbsp;
                <strong> INT:</strong> {character.ability.int}&nbsp;&nbsp;&nbsp;
                <strong> WIS:</strong> {character.ability.wis}&nbsp;&nbsp;&nbsp;
                <strong> CHA:</strong> {character.ability.cha}&nbsp;&nbsp;&nbsp;
                <br></br>
                <br></br>
                <p><strong> BACKGROUND: </strong></p>
                <p> {character.background} </p>
                <br></br>
                <br></br>
                <button className='dnd-button' onClick={() => downloadCharacter()}>Download Character as PDF</button>
                <br></br>
                <br></br>
                <button className='dnd-button' onClick={() => {
                    StartCreation();
                }}>Create New Character</button>
                <br></br>
                <br></br>
            </div>
        )    
    }
    else if(!isCreating){
        characterContent = (
            <>
                <br></br>
                <p className='custom-error'>No character created</p>
                <button className='dnd-button' onClick={() => {
                    StartCreation()
                }}>Create a new Character</button>
            </>
        )
    }

    let characterCreation;

    if(isCreating){
        characterCreation = (
            <div className='top-banner'>
                <h1>Build your own Character</h1>
                <form onSubmit={e => {
                    e.preventDefault(); // Prevents page reload
                    createCharacter()
                }}>
                    <br></br>
                    <strong>PLAYER: </strong>
                    <input className='dnd-input' type="text" name="playerName" id="playerName" required onChange={handleChange}></input>
                    <br></br>
                    <br></br>
                    <strong>NAME: </strong>
                    <input className='dnd-input' type="text" autoFocus name="name" id="name" required onChange={handleChange}></input>
                    <br></br>
                    <br></br>
                    <strong>LEVEL: </strong>
                    <input className='dnd-number-input' type="number" min='0' max='20' name="level" id="level" required onChange={handleChange}></input>
                    <br></br>
                    <br></br>
                    <strong>CLASS: </strong>
                    <input className='dnd-input' type="text" name="class" id="class" required onChange={handleChange}></input>
                    <br></br>
                    <br></br>
                    <strong>RACE: </strong>
                    <input className='dnd-input' type="text" name="race" id="race" required onChange={handleChange}></input>
                    <br></br>
                    <br></br>
                    <strong>ALIGNMENT: </strong>
                    <input className='dnd-input' type="text" name="alignment" id="alignment" required onChange={handleChange}></input>
                    <br></br>
                    <br></br>
                    <strong>STATISTICS:</strong>  
                    <br></br>
                    <br></br>
                    <strong>HP: </strong>
                    <input className='dnd-number-input' type="number" min='0' name="statistics.hp" id="hp" required onChange={handleNestedChange}></input>
                    <strong>AC: </strong>
                    <input className='dnd-number-input' type="number" min='0' name="statistics.ac" id="ac" required onChange={handleNestedChange}></input>
                    <strong>PROFICIENCY B: </strong>
                    <input className='dnd-number-input' type="number" min='0' max='20' name="statistics.profBonus" id="profBonus" required onChange={handleNestedChange}></input>
                    <br></br>
                    <br></br>
                    <strong>ABILITIES:</strong>
                    <br></br>
                    <br></br>
                    <strong> STR: </strong>
                    <input className='dnd-number-input' type="number" min='0' max='20' name="ability.str" id="str" required onChange={handleNestedChange}></input>
                    <strong> DEX: </strong>
                    <input className='dnd-number-input' type="number" min='0' max='20' name="ability.dex" id="dex" required onChange={handleNestedChange}></input>
                    <strong> CON: </strong>
                    <input className='dnd-number-input' type="number" min='0' max='20' name="ability.con" id="con" required onChange={handleNestedChange}></input>
                    <strong> INT: </strong>
                    <input className='dnd-number-input' type="number" min='0' max='20' name="ability.int" id="int" required onChange={handleNestedChange}></input>
                    <strong> WIS: </strong>
                    <input className='dnd-number-input' type="number" min='0' max='20' name="ability.wis" id="wis" required onChange={handleNestedChange}></input>
                    <strong> CHA: </strong>
                    <input className='dnd-number-input' type="number" min='0' max='20' name="ability.cha" id="cha" required onChange={handleNestedChange}></input>
                    <br></br>
                    <br></br>
                    <strong> BACKGROUND: </strong>
                    <br></br>
                    <br></br>
                    <textarea
                        rows={20}
                        className='dnd-input-textarea'
                        placeholder="Write your character's background here..."
                        required
                        name='background'
                        id='background'
                        onChange={handleChange}
                    />
                    <br></br>
                    <br></br>
                    <button className='dnd-button'>Add</button>
                </form>
            </div>
        )
    } else{
        characterCreation = (
            <>
            </>
        )
    }

    //DOWNLOADING CHARACTER
    async function downloadCharacter() {
        const texContent = format(); // your function that returns the .tex as string

        // Prepare form data to send
        const formData = new FormData();
        // Create a "file" object from the tex string
        const blob = new Blob([texContent], { type: "text/plain" });
        formData.append("texfile", blob, `${character.name}.tex`);

        try {
            const response = await fetch("https://13.60.74.149/generate-pdf", {
            method: "POST",
            body: formData,
            });

            if (!response.ok) throw new Error("Failed to generate PDF");

            const pdfBlob = await response.blob();
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${character.name}.pdf`;
            link.click();
        } catch (err) {
            console.error(err);
            alert("Error generating PDF");
        }
    }


    function format(){
        const finalString = String.raw`\documentclass[11pt]{article}
\usepackage[utf8]{inputenc}
\usepackage{graphicx}
\usepackage[margin=3cm]{geometry}
\usepackage[dvipsnames]{xcolor}
\usepackage{yfonts}

\usepackage{aurical}
\usepackage[T1]{fontenc}
\usepackage{tabularx}
 \usepackage{watermark}
\usepackage{tikz}

\usepackage{float}
\let\origfigure\figure
\let\endorigfigure\endfigure
\renewenvironment{figure}[1][2] {
    \expandafter\origfigure\expandafter[H]
} {
    \endorigfigure
}

\usepackage[hyphens]{url}

\usepackage{fancyhdr}
\pagestyle{fancy}

\fancypagestyle{firstpage}{

\lhead{\raisebox{0.2\height}{\includegraphics[width=3cm]{uploads/ipluslogo.png}}}
\chead{\footnotesize Smauler's Character}
\rhead{\footnotesize Versione 00}

\lfoot{\small \bfseries iPlus Service srl \\ \tiny \mdseries Milano – Via Ascanio Sforza, 65 – Tel. +39 02 500 20 850 \\ Morbegno – Via Fumagalli, 34 – Tel. +39 0342 610 111}   
\cfoot{}  
\rfoot{\tiny www.iplusservice.it \\ P.I./C.F. 00886720143 \\ Cap. Sociale 100.000€ i.v.}

\renewcommand{\headrulewidth}{0.1pt} 
\renewcommand{\footrulewidth}{0.1pt}
}

% Define header and footer
\pagestyle{fancy}
\setlength{\headheight}{28pt}
\lhead{\raisebox{0.2\height}{\includegraphics[width=3cm]{uploads/ipluslogo.png}}}
\chead{\footnotesize Smauler's Character}
\rhead{\footnotesize Versione 00}

\lfoot{\footnotesize \bfseries iPlus Service srl \\ \scriptsize \mdseries L’innovazione digitale per la tua azienda}   
\cfoot{}  
\rfoot{\thepage}    

\renewcommand{\headrulewidth}{0.4pt}
\renewcommand{\footrulewidth}{0.4pt}

\usepackage{amsmath,amssymb}
\usepackage{iftex}
\ifPDFTeX
  \usepackage[T1]{fontenc}
  \usepackage[utf8]{inputenc}
  \usepackage{textcomp} % provide euro and other symbols
\else % if luatex or xetex
  \usepackage{unicode-math} % this also loads fontspec
  \defaultfontfeatures{Scale=MatchLowercase}
  \defaultfontfeatures[\rmfamily]{Ligatures=TeX,Scale=1}
\fi
\usepackage{lmodern}
\ifPDFTeX\else
  % xetex/luatex font selection

    \newfontfamily{\TitilliumWeb}[
      Extension = .ttf,
      Ligatures = TeX,
      UprightFont = *-Regular,
      BoldFont = *-Bold
    ]{TitilliumWeb}

    \setmainfont[
      Extension = .ttf, 
      UprightFont = *-Regular, 
      BoldFont = *-Bold
    ]{TitilliumWeb}
\fi
% Use upquote if available, for straight quotes in verbatim environments
\IfFileExists{upquote.sty}{\usepackage{upquote}}{}
\IfFileExists{microtype.sty}{% use microtype if available
  \usepackage[]{microtype}
  \UseMicrotypeSet[protrusion]{basicmath} % disable protrusion for tt fonts
}{}
\makeatletter
\@ifundefined{KOMAClassName}{% if non-KOMA class
  \IfFileExists{parskip.sty}{%
    \usepackage{parskip}
  }{% else
    \setlength{\parindent}{0pt}
    \setlength{\parskip}{6pt plus 2pt minus 1pt}}
}{% if KOMA class
  \KOMAoptions{parskip=half}}
\makeatother
\usepackage{xcolor}
\usepackage{longtable,booktabs,array}
\usepackage{calc} % for calculating minipage widths
% Correct order of tables after \paragraph or \subparagraph
\usepackage{etoolbox}
\makeatletter
\patchcmd\longtable{\par}{\if@noskipsec\mbox{}\fi\par}{}{}
\makeatother
% Allow footnotes in longtable head/foot
\IfFileExists{footnotehyper.sty}{\usepackage{footnotehyper}}{\usepackage{footnote}}
\makesavenoteenv{longtable}
\setlength{\emergencystretch}{3em} % prevent overfull lines
\providecommand{\tightlist}{%
  \setlength{\itemsep}{0pt}\setlength{\parskip}{0pt}}
\setcounter{secnumdepth}{-\maxdimen} % remove section numbering
\ifLuaTeX
  \usepackage{selnolig}  % disable illegal ligatures
\fi
\usepackage{bookmark}
\IfFileExists{xurl.sty}{\usepackage{xurl}}{} % add URL line breaks if available
\urlstyle{same}
\hypersetup{
  hidelinks,
  pdfcreator={LaTeX via pandoc}}
  
\newcommand*\circled[1]{\tikz[baseline=(char.base)]{
            \node[shape=circle,draw,inner sep=2pt] (char) {#1};}}
\definecolor{OCRA}{RGB}{204,119,34}

\begin{document}
\thiswatermark{\centering \put(-150,-850){\includegraphics[scale=1.5]{paper.jpg}} }
\begin{minipage}{0.5\textwidth}

%\includegraphics{img/zitto.png}
\end{minipage}%
\begin{minipage}{0.8\textwidth}%\raggedleft

\begin{flushleft}
\Huge{${character.name}} \\
\Large{${character.class} ${character.level} - ${character.race}} \\   %class level - race
\large{${character.alignment}} \\   %alignment
\textcolor{OCRA}{College of Lore} 
\vspace{1cm}

\begin{tabular}{cccccc}
Str & Dex & Con & Int & Wis & Cha \\ \hline
${character.ability.str} & ${character.ability.dex}  & ${character.ability.con}  & ${character.ability.int}  & ${character.ability.wis}  & ${character.ability.cha} \\ 
 & $\bullet$ & & & & $\bullet$
\end{tabular}

\vspace{1cm}
\textcolor{OCRA}{HP} \circled{${character.statistics.hp}} \hspace{0.5cm} \textcolor{OCRA}{AC} \circled{${character.statistics.ac}} \hspace{0.5cm} \textcolor{OCRA}{PROFICIENCY BONUS} \circled{${character.statistics.profBonus}}
\end{flushleft}
\end{minipage}
 
\vspace{1cm}
{\huge \Fontauri Background:} \\
\vspace{0.5cm}
 \begin{quote}
 \textit{"${character.background}"}  
 \end{quote}

 \newpage
\thiswatermark{\centering \put(-150,-850){\includegraphics[scale=1.5]{paper.jpg}} }
\begin{minipage}[t]{.8\textwidth}
{\huge \Fontauri Features}\\
\textcolor{OCRA}{Kenku}\\
\textbf{Mimica} Puoi riprodurre i suoni che hai sentito, incluse le voci.\\
\textbf{Contraffazione Esperta} Puoi duplicare manufatti e scritture di altre creature. Disponi di vantaggio \\
\textcolor{OCRA}{Bard}\\
\textbf{Bardic Inspiration}(d8)\\
\textbf{Jack of all trades} Half Proficiency to Ability Check\\
\textbf{Song of Rest} 1d6 to Short Rest\\
\textbf{Font of ispiration} BI regained with Short Rest\\
\textbf{Countercharm} As an action start to sing. All allies in 30f have adv on being charmed or frightened.\\
\textcolor{OCRA}{College of Lore}\\
\textbf{Cutting Words} When a creatures make an attack roll 60f from you you can use a BI and sub from the attack.\\
\textbf{Additional Magic Secrets}\\
\textcolor{OCRA}{Rouge}\\
\textbf{Cunning Action}\\
\textbf{Sneak Attack (1d6)}\\
\end{minipage}

\end{document}`
        return finalString;
    }   

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
            {characterCreation}

            {characterContent}
        </>
    )
}

export default CharacterComponent

/*
TO DO
    - Make character downloadable (DONE)
    - Write character data in txt file in a pretty way (DONE)
    - Add to the form a field to add a character image
    - Generate a PDF instead of a txt file
    - Make character downloadable only when it exists (DONE)
    - Find a way to generate pdf from latex in React
*/