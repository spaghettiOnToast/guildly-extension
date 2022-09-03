import { gql } from "@apollo/client";

const getGuilds = gql`
  query get_guilds($manager: String) {
    event(where: { transmitter_contract: { _eq: $manager } }) {
      arguments {
        name
        value
      }
    }
  }
`;

const getMasteredGuilds = gql`
  query get_mastered_guilds($manager: String, $account: jsonb) {
    event(
      where: {
        transmitter_contract: { _eq: $manager }
        arguments: { value: { _eq: $account } }
      }
    ) {
      arguments {
        name
        value
      }
    }
  }
`;

const getBatchWhitelisted = gql`
  query get_batch_whitelisted($guilds: [String]) {
    event(
      where: {
        name: { _eq: "member_whitelisted" }
        transmitter_contract: { _in: $guilds }
      }
    ) {
      transmitter_contract
      arguments(where: { name: { _eq: "account" } }) {
        value
      }
    }
  }
`;

const getAccountGuilds = gql`
  query account_guilds($certificate: String, $account: jsonb) {
    event(
      where: {
        transmitter_contract: { _eq: $certificate }
        name: { _in: ["mint_certificate", "burn_certificate"] }
        arguments: { value: { _eq: $account } }
      }
      order_by: { name: desc }
    ) {
      name
      arguments {
        value
        name
      }
    }
  }
`;

const getGuildName = gql`
  query guild_name($manager: String, $guild: jsonb) {
    event(
      where: {
        transmitter_contract: { _eq: $manager }
        arguments: { value: { _eq: $guild } }
      }
    ) {
      arguments(where: { name: { _eq: "name" } }) {
        name
        value
      }
    }
  }
`;

const getGuildNames = gql`
  query guild_names($manager: String, $guilds: [jsonb]) {
    event(
      where: {
        transmitter_contract: { _eq: $manager }
        arguments: { value: { _in: $guilds } }
      }
    ) {
      name
      arguments {
        name
        value
      }
    }
  }
`;

const getOwnedGuildItems = gql`
  query guild_owned_items($guild: String, $account: jsonb) {
    event(
      where: {
        name: { _in: ["deposited", "withdrawn"] }
        transmitter_contract: { _eq: $guild }
        arguments: { value: { _eq: $account } }
      }
    ) {
      name
      transmitter_contract
      arguments {
        value
        name
      }
    }
  }
`;

const getGuildExecutions = gql`
  query guild_executions($guild: String) {
    event_aggregate(
      where: {
        name: { _eq: "transaction_executed" }
        transmitter_contract: { _eq: $guild }
      }
    )
    aggregate {
      count
    }
  }
`;

const getGuildMembers = gql`
  query guild_members($certificate: String, $guild: jsonb) {
    event(
      where: {
        transmitter_contract: { _eq: $certificate }
        name: { _in: ["mint_certificate", "burn_certificate"] }
        arguments: { value: { _eq: $guild } }
      }
    ) {
      name
      arguments {
        value
        name
      }
    }
  }
`;

const getGuildPermissions = gql`
  query guild_permissions($guild: String) {
    event(
      where: {
        transmitter_contract: { _eq: $guild }
        name: { _eq: "permissions_set" }
      }
    ) {
      arguments(where: { name: { _eq: "permissions" } }) {
        name
        value
      }
    }
  }
`;

const getWhitelistedAccountRole = gql`
  query get_whitelisted_account_role($guild: String, $account: jsonb) {
    argument(
      where: {
        event: {
          transmitter_contract: { _eq: $guild }
          name: { _eq: "member_whitelisted" }
          arguments: { value: { _eq: $account } }
        }
      }
    ) {
      name
      value
    }
  }
`;

const getAccountWhitelisted = gql`
  query get_account_whitelisted($guilds: [String], $account: jsonb) {
    event(
      where: {
        name: { _eq: "member_whitelisted" }
        transmitter_contract: { _in: $guilds }
        arguments: { value: { _eq: $account } }
      }
    ) {
      transmitter_contract
      arguments {
        value
        name
      }
    }
  }
`;

const getGuildWhitelisted = gql`
  query get_guild_whitelisted($guild: String) {
    event(
      where: {
        name: { _eq: "member_whitelisted" }
        transmitter_contract: { _eq: $guild }
      }
    ) {
      arguments {
        value
        name
      }
    }
  }
`;

const getLatestBlock = gql`
  query latest_block {
    block(order_by: { block_number: desc }, limit: 1) {
      block_number
    }
  }
`;

export {
  getGuilds,
  getMasteredGuilds,
  getBatchWhitelisted,
  getAccountGuilds,
  getGuildName,
  getGuildNames,
  getOwnedGuildItems,
  getGuildExecutions,
  getGuildMembers,
  getGuildPermissions,
  getWhitelistedAccountRole,
  getAccountWhitelisted,
  getGuildWhitelisted,
  getLatestBlock,
};
