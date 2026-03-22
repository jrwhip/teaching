import { Amplify } from 'aws-amplify';
import * as outputs from '../../../amplify_outputs.json';

Amplify.configure(outputs as any);
