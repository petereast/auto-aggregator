import {read_events} from './parser';
import * as R from 'ramda';
import {events_by_payload, simple_aggregate, example_query} from './aggregator';

console.log("[INFO] Startup...");
const results = read_events();

// { AccountInvitedToOrg:
//    { sequence: 0,
//      payload:[ 'invite_token', 'name', 'organisation_id', 'organisation_type' ],
//      state: { membership_status: [Object] } },
//  AccountInviteToOrgRevoked:
//    { sequence: 1,
//      payload: [ 'invite_token' ],
//      state: { membership_status: [Object] } },
//  AccountInviteToOrgAccepted:
//  { sequence: 1,
//    payload: [ 'invite_token', 'user_id' ],
//    triggers: [ 'SomethingElse' ],
//    state: { membership_status: [Object] } },
//  AccountCreated:
//  { sequence: 1,
//    payload: [ 'name', 'email', 'user_id' ],
//    triggers: [ 'AccountInviteToOrgAccepted' ] } }
// :
