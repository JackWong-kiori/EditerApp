import SwaggerUI from 'swagger-ui-react';

const SwaggerUIComponent = ({ spec, url }) => {
  return <SwaggerUI spec={spec} url={url} />;
};

export default SwaggerUIComponent;