import { Amplify, type ResourcesConfig } from 'aws-amplify';
import * as outputs from '../../../amplify_outputs.json';

// Amplify Gen 2 outputs JSON doesn't match ResourcesConfig at the type level;
// it is validated at runtime by Amplify.configure's internal parser.
Amplify.configure(outputs as unknown as ResourcesConfig);
