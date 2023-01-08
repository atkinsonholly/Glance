# GLANCE

> **Web3 Liveness Token Proof-of-Concept. Soulbound video NFTs with verification functionality**

The Glance platform connects users with Livepeer video & streaming functionality together with a custom smart-contract.

Components:
- Glance frontend https://funny-cascaron-71bcc0.netlify.app/ (soon glanc.eth!)
- Glance smart-contract `Glance.sol`
- Glance sub-graph at https://thegraph.com/hosted-service/subgraph/atkinsonholly/glance 

Outline:

- You have created a video of yourself and saved it via Livepeer Studio on IPFS
- Grab asset ID and mint your Glance at https://funny-cascaron-71bcc0.netlify.app/ (you can only have one Glance at any time)
- Once you have a Glance, you can kick off a stream to become "verified" (you aren't verified just because you have a Glance)
- Only admin can verify you
- Token owners can be filtered by "verified" status
- Verification expires after a fixed time period
- In the event that your account is compromised, your Glance can be burned

TODOS:

- Upload to IPFS, view at glanc.eth
- Encrypted video
- Gated streaming
...

For now, view at: https://funny-cascaron-71bcc0.netlify.app/

## Author

* **Holly Atkinson** - https://github.com/atkinsonholly