// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

//Nous importons les librairies dont nous allons avoir besoin
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ERC721A.sol";

// Ici, nous allons créer notre contrat TwitterNFT qui est un ERC721A et Ownable que nous allons importer afin de pouvoir appeler onlyOwner
// qui va nous permettre de pouvoir appeler certaines fonctions uniquement si nous sommes l'owner du contrat (comme la fonction withdraw ou les différents setters par exemple)
contract TwitterNFT is Ownable, ERC721A, ReentrancyGuard {
    using Strings for uint256;

    // Définition de notre baseURI (pour GET les données en json de chaque NFT mint)
    string public baseURI;

    // Notre max supply est de 50
    uint256 private constant MAX_SUPPLY = 50;

    // Le prix d'un NFT est de 0.002 ether
    uint256 public nftPrice = 0.002 ether;

    // Ici nous avons un mapping d'adresse => uint afin de pouvoir voir combien de nft possède une adresse
    // (Pour un maximum de 3 NFT par wallet)
    mapping(address => uint256) public amountNFTsperWallet;

    // Notre constructeur qui comprend notre baseURI (lien vers nos JSON)
    constructor(string memory _baseURI) ERC721A("TWITTERNFT", "TNFT") {
        //Ici, le nom de notre collection ainsi que le nom de notre token
        baseURI = _baseURI;
    }

    // On créer notre fonction mint qui va prendre 2 paramètres, l'address qui va recevoir le nft et la quantité de NFT
    function mint(address _account, uint256 _quantity) external payable {
        uint256 price = nftPrice;

        // Les require nous servent à faire des contrôles, si on passe ces contrôles, alors notre fonction mint pourras
        // être éxécutée
        require(price != 0, "Price is 0"); // il faut que le prix d'un NFT sois différent de 0
        require(
            amountNFTsperWallet[msg.sender] + _quantity <= 3,
            "Maximum 3 NFT par wallet"
        ); // Que l'address qui mint ai moins de 3 NFT
        require(totalSupply() + _quantity <= MAX_SUPPLY, "Vous mintez plus d'NFT que la max supply"); // Que l'addition totalSupply() (supply actuelle) + la quantité que l'utilisateur veut mint ne dépasse pas
        require(msg.value >= price * _quantity, "Vous n'avez pas assez d'ETH"); // Il faut que l'on envoie le nombre d'eth requis (nftPrice * la quantité d'NFT que l'on veux mint)

        // Si on passe tout ces require et que tout est OK :
        amountNFTsperWallet[msg.sender] += _quantity; // on ajoute au mapping le nombre d'NFT que cet utilisateur à mint
        _safeMint(_account, _quantity); // on apelle la fonction _safeMint qui va effectuer le mint
    }

    // Cette fonction est un setter qui va nous servir à set la variable baseURI de notre constructeur (utile si il y'a un système de reveal par exemple)
    function setBaseUri(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    // la fonction token uri va prendre en paramètre l'id d'un token minter et nous retourner le lien vers son JSON
    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(_tokenId), "Le token n'existe pas encore"); // Il faut que le token existe

        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json")); // Nous allons retourner : baseURI+tokenID+.json
    }

    // Cette fonction vas nous servir à ce qu'uniquement l'owner du contrat puisse retirer l'eth gagner par le mint des NFT
    function withdrawMoney() external onlyOwner nonReentrant {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }
}
