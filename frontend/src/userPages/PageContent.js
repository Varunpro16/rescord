// src/PageContent.js
import React from 'react';
import ShowMap from './ShowMap';
import Chat from './Chat';

const PageContent = ({ selectedHeading, peopleLocation, userId}) => {
console.log("pagecontent: ",peopleLocation);
  return (
    <div className="page-content">
      {selectedHeading === 'Map' && 
        <ShowMap peopleLocation={peopleLocation}/>
      }
      {selectedHeading === 'Description' && (
        <p>This is the content for Heading 2.</p>
      )}
      {selectedHeading === 'Chat' && 
        <Chat user={userId}/>
      }
    </div>
  );
};

export default PageContent;
