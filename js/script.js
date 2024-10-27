$(document).ready(function(){
    //connect to metamask wallet 
    $("#connectWallet,#connectWallet1").click(async function(e){
        e.preventDefault();
        if(window.ethereum){
            window.ethereum.enable();
            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile && window.ethereum.isMetaMask==true){
                    const accounts_ = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    //alert(accounts_);
                
            }else{
                const accounts_ = await ethereum.request({ method: 'eth_accounts' });
                  console.log(accounts_);
            }
            //const accounts_ = await ethereum.request({ method: 'eth_accounts' });
            if(accounts_!=""){
                window.location.href = "";
            }
        }
    });
    function init(){
                
        contractInstance = new myweb3.eth.Contract(ABI, contractAddress, {
                from: myAccountAddress, // default from address
        });
        showtotalSupply();
        
    }
    setTimeout(init,2000);
    
    async function showtotalSupply(){
         var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile){
            const totalSupply = await contractInstance.methods.totalSupply().call();
            $('#totalSupply').html(totalSupply);
            
        }else{
            const totalSupply = await contractInstance.methods.totalSupply().call();
            
            $('#totalSupply').html(totalSupply);
            
        }
    }
    
    $(document).on("click", ".mintNft",async function(e){
       
        e.preventDefault();
        var numberOfTokens = $(this).data('tokens');
        var tokenPrice = 0.02*1e18;
        var gasLimit = 200000;
        if(numberOfTokens==1){
            gasLimit = 200000;
        }else if(numberOfTokens==5){
            gasLimit = 800000;
        }else if(numberOfTokens==10){
            gasLimit = 1400000;
        }else if(numberOfTokens==20){
            gasLimit = 2500000;
        }else{
            gasLimit = 500000;
        }
        var payableAmount = tokenPrice *  numberOfTokens;
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile && window.ethereum.isMetaMask==true) {
            
                const fetchResponse =  await fetch(gasTrakerAPI);
                const edata = await fetchResponse.json();   
                var web3GasPrice = edata.result.ProposeGasPrice;
                web3GasPrice = web3GasPrice.toString();
                gasLimit = gasLimit.toString();
                payableAmount = payableAmount.toString();
                payableAmount =  myweb3.utils.toHex(payableAmount);
                web3GasPrice =  myweb3.utils.toHex(web3GasPrice);
                gasLimit =  myweb3.utils.toHex(gasLimit);
                var data =await contractInstance.methods.mintFuego(numberOfTokens).encodeABI();
                const transactionParameters = {
                  nonce: '0x00', // ignored by MetaMask
                  gasPrice: web3GasPrice, // customizable by user during MetaMask confirmation.
                  gas: gasLimit, // customizable by user during MetaMask confirmation.
                  to: contractAddress, // Required except during contract publications.
                  from: myAccountAddress, // must match user's active address.
                  value: payableAmount, // Only required to send ether to the recipient from the initiating external account.
                  data: data, // Optional, but used for defining smart contract creation and interaction.
                  //chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
                };
            
                // txHash is a hex string
                // As with any RPC call, it may throw an error
                const txHash = await ethereum.request({
                  method: 'eth_sendTransaction',
                  params: [transactionParameters],
                });
                if(txHash){
                        swal("Success !", "Successfully Minted $FLAMES.", "success");
                        //alert('Successfully Minted NFTs.');
                }
        }else{
                //const fetchResponse =  await fetch(gasTrakerAPI);
                //const edata = await fetchResponse.json();   
                //var web3GasPrice = edata.result.ProposeGasPrice;
            const web3GasPrice = await myweb3.eth.getGasPrice();
            var result = await contractInstance.methods.mintFuego(numberOfTokens).send({
                from: myAccountAddress,
                to: contractAddress,
                //gasPrice: 100,
                gasPrice: web3GasPrice,
                gasLimit: gasLimit,
                value : payableAmount,       
            });
    
            if(result){
                swal("Success !", "Successfully Minted $FLAMES.", "success");
                //alert('Successfully Minted NFTs.');
            }
        }

    });
    
});