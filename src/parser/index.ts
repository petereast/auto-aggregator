// Code to ingest the events based on definitions, and analyse the entities and the relationships between them
import * as yaml from 'js-yaml';
import * as fs from 'fs';
const definitions_location = "./events.yaml";

const read_events = (loc: string = "./events.yaml"): any => {
  const raw_events = yaml.safeLoad(fs.readFileSync('./events.yaml', 'utf-8'));
  // Maybe do some more stuff here?
  // Possibly validate data_structure
  if (validate(raw_events)) {
    return raw_events.defs;
  } else {
    return undefined;
  }
};

const parse_query = (q: string) => {
  // return a query object
  // q takes the form
  // SELECT {attributes} WHERE [{condition}]
};

const validate = (defs: any): boolean => {
  return true;
};

export {
  read_events,
};
