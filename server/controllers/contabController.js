'use strict'
const accountingCatalogModel = require('../models/accountingCatalog');
const businessModel = require('../models/business');
const moment = require('moment');
const definedAccountingCatalogModel = require('../models/definedAccountingCatalog');
const sequelize = require('sequelize');
const jwt = require('jwt-simple');

function viewAccountingCatalog(req, res){
    if(req.headers.cookie==undefined){
        res.redirect('/contab/sign');
    }
    else{
        let data = req.headers.cookie.split("=");
        const token =  jwt.decode(data[1],'b33dd00.@','HS512') 
        return res.render('accountingCatalog' ,{
                userData: token,
                active : 2,
                titlePage : 'Catálogo contable',
                processes : token.processes,
                menu : token.menu 
            })
           
    }
    
}

function accountingCatalog(req, res){
    let data = req.headers.cookie.split("=");
    const token =  jwt.decode(data[1],'b33dd00.@','HS512') 
    let likeData = []
    if(typeof(req.query.search) !== "undefined" && req.query.search !== ''){
        likeData=[{'accName': {[sequelize.Op.like]: `%${req.query.search}%`}}, {'accCode': {[sequelize.Op.like]: `%${req.query.search}%`}}, {'accQuantityNivels': {[sequelize.Op.like]: `%${req.query.search}%`}} ]
    }
    if (typeof(req.params.id) !== "undefined") {
        accountingCatalogModel.findAll({where:{'useIdFK': token.useId, "accId" : req.params.id}}).then( accountingCatalog => {
            return res.status(200).json({accountingCatalog :accountingCatalog[0]});
        })
    }
    else{
        if(typeof(req.query.search) !== "undefined" && req.query.search !== ''){
            accountingCatalogModel.findAll({
                where:{
                    'useIdFK': token.useId,
                    [sequelize.Op.or]: likeData
                }}).then( accountingCatalog => {
                return res.status(200).json({rows: accountingCatalog, total:accountingCatalog.length});
            })
        }
        else{
            accountingCatalogModel.findAll({
                where:{
                    'useIdFK': token.useId
                }}).then( accountingCatalog => {
                return res.status(200).json({rows: accountingCatalog, total:accountingCatalog.length});
            })
        }    

    }
} 

function saveAccountingCatalog(req, res){
    let data = req.headers.cookie.split("=");
    const token =  jwt.decode(data[1],'b33dd00.@','HS512') 
    //hacer las validaciones que el numero no exista
    // si ya existe el ID seria update por el momento save

    let accNivels = new Array();
    accNivels = {
        accName1:req.body.accName1,
        accNivel1: req.body.accNivel1,
        accName2:req.body.accName2,
        accNivel2: req.body.accNivel2,
        accName3:req.body.accName3,
        accNivel3: req.body.accNivel3,
        accName4:req.body.accName4,
        accNivel4: req.body.accNivel4,
        accName5:req.body.accName5,
        accNivel5: req.body.accNivel5,
        accName6:req.body.accName6,
        accNivel6: req.body.accNivel6,
        accName7:req.body.accName7,
        accNivel7: req.body.accNivel7,
        accName8:req.body.accName8,
        accNivel8: req.body.accNivel8,
        accName9:req.body.accName9,
        accNivel9: req.body.accNivel9,
        accName10:req.body.accName10,
        accNivel10: req.body.accNivel10,
        accName11:req.body.accName11,
        accNivel11: req.body.accNivel11,
        accName12:req.body.accName12,
        accNivel12: req.body.accNivel12        
    };


    if(req.body.accId){
        accountingCatalogModel.update({
            accName: req.body.accName,
            accIsGlobal: req.body.accIsGlobal,
            accCode: req.body.accCode,
            accQuantityNivels: req.body.accQuantityNivels,
            accNivels: JSON.stringify(accNivels).toString(),
            accStatus : 1,
            accSeparator : req.body.accSeparator,
            updateAt: moment(new Date()).format('YYYY-MM-DD')
            }, {where : {'accId' :req.body.accId}}).then(function () {
            return  res.status(200).json({ message: "Se ha actualizado con exito" });
        })
    }
    else{
        const dataToSave = new accountingCatalogModel({
            accName: req.body.accName,
            accIsGlobal: req.body.accIsGlobal,
            accCode: req.body.accCode,
            accQuantityNivels: req.body.accQuantityNivels,
            accNivels: JSON.stringify(accNivels).toString(),
            accStatus : 1,
            accSeparator : req.body.accSeparator,
            useIdFk : token.useId,
            createdAt: moment(new Date()).format('YYYY-MM-DD'),
            updateAt: moment(new Date()).format('YYYY-MM-DD')
        });
          //se devuelve el usuaurio
        return dataToSave.save().then(function (accountingCatalogSaved) {
            res.status(200).json({ message: "Se ha creado con exito" });
        })
    }


}

function viewDefineCatalog(req, res){
    if(req.headers.cookie==undefined){
        res.redirect('/contab/sign');
    }
    else{
        let data = req.headers.cookie.split("=");
        const token =  jwt.decode(data[1],'b33dd00.@','HS512') 
        // obtengo las empresas
        // obtengo los catalogos
        accountingCatalogModel.findAll({where:{'useIdFK': token.useId}}).then( accountingCatalog => {
            businessModel.findAll({where:{'useIdFK': token.useId}}).then( business => {
                return res.render('defineCatalog' ,{
                    userData: token,
                    active : 2,
                    titlePage : 'Definir catálogo contable',
                    accountingCatalog : accountingCatalog,
                    business : business,
                    processes : token.processes,
                    menu : token.menu 
                })   
            })
        })

           
    }
    
}

function viewBusiness(req, res){
    if(req.headers.cookie==undefined){
        res.redirect('/contab/sign');
    }
    else{
        let data = req.headers.cookie.split("=");
        const token =  jwt.decode(data[1],'b33dd00.@','HS512') 
        return res.render('business' ,{
                userData: token,
                active : 1,
                titlePage : 'Empresas',
                processes : token.processes,
                menu : token.menu 
            })           
    }    
}

function business(req, res){

    let data = req.headers.cookie.split("=");
    const token =  jwt.decode(data[1],'b33dd00.@','HS512') 
    let likeData = []
    if(typeof(req.query.search) !== "undefined" && req.query.search !== ''){
        likeData=[{'busName': {[sequelize.Op.like]: `%${req.query.search}%`}}, {'busEmail': {[sequelize.Op.like]: `%${req.query.search}%`}}, {'busPhone': {[sequelize.Op.like]: `%${req.query.search}%`}}, {'busJuriricalId': {[sequelize.Op.like]: `%${req.query.search}%`}} ]
        businessModel.findAll({
            where:{'useIdFK': token.useId,
            [sequelize.Op.or]: likeData
        }}).then( business => {
            return res.status(200).json({rows: business, total:business.length});
        })
    }
    else{
        businessModel.findAll({where:{'useIdFK': token.useId}}).then( business => {
            return res.status(200).json({rows: business, total:business.length});
        })
    }

} 

function saveBusiness(req, res){
    let data = req.headers.cookie.split("=");
    const token =  jwt.decode(data[1],'b33dd00.@','HS512') 
    const dataToSave = new businessModel({
        busName: req.body.busName,
        useIdFk: token.useId,
        busStatus: 1,
        busJuriricalId: req.body.busJuriricalId,
        busNameFantasy: req.body.busNameFantasy,
        busMoney: req.body.busMoney,
        busEmail: req.body.busEmail,
        busPhone: req.body.busPhone,
        createdAt: moment(new Date()).format('YYYY-MM-DD'),
        updateAt: moment(new Date()).format('YYYY-MM-DD')
      });
      //se devuelve el usuaurio
      return dataToSave.save().then(function (businessSaved) {
        res.status(200).json({ message: "Se ha creado con exito" });
      })

}

function definedAccountingCatalog(req, res){
    let data = req.headers.cookie.split("=");
    const token =  jwt.decode(data[1],'b33dd00.@','HS512') 

    definedAccountingCatalogModel.hasOne(businessModel,{foreignKey:'busId',sourceKey: 'busIdFk'});
    definedAccountingCatalogModel.hasOne(accountingCatalogModel,{foreignKey:'accId',sourceKey: 'accIdFk'});
    
    if(typeof(req.query.search) !== "undefined" && req.query.search !== ''){      
        let likeData =  [{'$accountingCatalog.accName$': {[sequelize.Op.like]: `%${req.query.search}%`}},{'$business.busName$': {[sequelize.Op.like]: `%${req.query.search}%`}}]  
        definedAccountingCatalogModel.findAll({ 
            where:{'useIdFK': token.useId,
            [sequelize.Op.or]: likeData
            },
            include: [{
                model: businessModel,
                require: true,
            }, {  
                model: accountingCatalogModel,
                required: true,
            }]
        }).then(definedAccountingCatalog =>{        
            return res.status(200).json({rows: definedAccountingCatalog, total:definedAccountingCatalog.length});
        })
    }
    else{

        definedAccountingCatalogModel.findAll({where:{'useIdFK': token.useId},
            include: [{
                model: businessModel,
                require : true
            }, {  
                model: accountingCatalogModel,
                required: true
            }]
        }).then(definedAccountingCatalog =>{        
            return res.status(200).json({rows: definedAccountingCatalog, total:definedAccountingCatalog.length});
        })
    }
}

function saveDefinedAccountingCatalog(req, res){   
    let data = req.headers.cookie.split("=");
    const token =  jwt.decode(data[1],'b33dd00.@','HS512') 

    //agregar validacion de solo un catalogo
    definedAccountingCatalogModel.findAll({where:{accIdFk: req.body.accId, busIdFk: req.body.busId}}).then(definedAccountingCatalog=>{
        if(definedAccountingCatalog.length > 0){
            res.status(400).json({ message: "Ya existe un catálogo definido para la empresa." });
        }
        else{
            const dataToSave = new definedAccountingCatalogModel({
                accIdFk: req.body.accId,
                useIdFk: token.useId,
                busIdFk: req.body.busId,
                createdAt: moment(new Date()).format('YYYY-MM-DD'),
                updateAt: moment(new Date()).format('YYYY-MM-DD')
            });
            return dataToSave.save().then(function () {
                res.status(200).json({ message: "Se ha creado con exito" });
            })
        }

    })    
}

module.exports = {
    viewAccountingCatalog,
    accountingCatalog,
    saveAccountingCatalog,
    viewDefineCatalog,
    viewBusiness,
    business,
    saveBusiness,
    definedAccountingCatalog,
    saveDefinedAccountingCatalog,
}