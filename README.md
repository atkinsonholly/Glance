# GLANCE

> **Web3 Liveness Token Proof-of-Concept. Soulbound video NFTs with verification functionality**

The Glance platform connects users with Livepeer video & streaming functionality together with a custom smart-contract.

Components:
- Glance frontend https://funny-cascaron-71bcc0.netlify.app/ (soon glanc.eth with IPFS!)
- Glance smart-contract `Glance.sol` - currently deployed on Polygon Mumbai - see [Polygonscan](https://mumbai.polygonscan.com/address/0x288Ca3Cd14604D6DcFe2a7d0cfc371e2fF6Aa1f6#code)
- Soulbound token interface `IERC5192` means 1 Glance per account at any time with lock/unlock functionality
- Glance sub-graph at https://thegraph.com/hosted-service/subgraph/atkinsonholly/glance 

Outline:

- You have created a short **video** of yourself and saved it via **Livepeer Studio** on **IPFS**
- Grab the video's asset ID and **mint** your Glance at https://funny-cascaron-71bcc0.netlify.app/ (you can only have one Glance at any time)
- Once you have a Glance, you can kick off a **stream** and become "verified" (you aren't verified just because you have a Glance)
- Only admin can **verify** you
- Token owners can be filtered by "verified" **status**
- Verification **expires** after a fixed time period
- In the event that your account is compromised, your Glance can be **burned**

TODOS:

- Upload to IPFS, view at glanc.eth
- Encrypted video
- Gated streaming
...

For now, view at: https://funny-cascaron-71bcc0.netlify.app/

## Author

* **Holly Atkinson** - https://github.com/atkinsonholly