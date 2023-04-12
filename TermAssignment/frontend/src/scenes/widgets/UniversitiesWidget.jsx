import UniveristyWidget from "./UniveristyWidget";

const UniversitiesWidget = ({ universities }) => {
    return (
        <>
            {universities.map((university) => (
                <UniveristyWidget key={university.ITEM_ID} university={university}/>
                )
            )}
        </>
    );
  };
  
export default UniversitiesWidget;