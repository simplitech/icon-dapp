# How to reset the test environment
Inside the `sdk` folder, run the following commands:
- Recompile the smart contract if needed.
- `neoxp reset -f --input ..\default.neo-express`
- `neoxp run -s 1 --input ..\default.neo-express`
- `neoxp policy sync MainNet genesis --input ..\default.neo-express`
- `neoxp transfer 200000 GAS genesis owner --input ..\default.neo-express`
- `npm i`
- `npm run build`
- `npm run sc-deploy`
- copy the script hash from the deploy message and use it as an argument for the next command 
- `npm run sc-metadata 0x0000000000000000000000000000000000000000`
- `neoxp checkpoint create ..\postSetup --force --input ..\default.neo-express`
