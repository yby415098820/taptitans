/**
 * Created by tom on 15/12/1.
 */
module tt {
    export class GuildManage {
        static listGuilds(start,cb,fail) {
            gm.network.request("guild.guildHandler.listGuilds", {start:start}, (data) => {
                Util.invokeCallback(cb,data);
            },fail)
        }

        static createGuild(name,icon,needReq,bpLimit,cb,fail){
            gm.network.request("guild.guildHandler.createGuild", {name:name,icon:icon,needReq:needReq,bpLimit:bpLimit}, (data) => {
                if(data){
                    gm.network.sendAction("createGuild", {gid:data.id}, function(obj) {
                        gm.dataManage.data.guild = data.id;
                        Util.invokeCallback(cb);
                    }.bind(this),fail);
                }
            },fail)
        }

        static findGuild(name,cb,fail){
            gm.network.request("guild.guildHandler.findGuild", {name:name}, (data) => {
                Util.invokeCallback(cb,data);
            },fail)
        }

        static joinGuild(id,cb,fail){
            gm.network.request("guild.guildHandler.joinGuild", {gid:id}, (data) => {
                Util.invokeCallback(cb,data);
            },fail)
        }

        static autoEnterGuild(cb,fail){
            gm.network.request("guild.guildHandler.fasterJoinGuild", {}, (data) => {
                if(data){
                    cb(data);
                }
            }, fail)
        }

        static joinGuildWithoutReq(gid,cb,fail){
            gm.network.request("guild.guildHandler.joinGuildWithoutReq", {gid:gid}, (data) => {
                gm.dataManage.data.guild = gid;
                Util.invokeCallback(cb,data);
            },fail)
        }

        static randomTenGuild(cb,fail){
            gm.network.request("guild.guildHandler.randomTenGuild", {}, (data) => {
                Util.invokeCallback(cb,data);
            },fail)
        }

        static queryById(id,cb,fail){
            gm.network.request("guild.guildHandler.queryById", {gid:id}, (data) => {
                Util.invokeCallback(cb,data);
            },fail)
        }

        static modifyNotice(id,text,cb,fail){
            gm.network.request("guild.guildHandler.modifyNotice", {gid:id,text:text}, (data) => {
                Util.invokeCallback(cb,data);
            },fail)
        }

        static approve(id,reqId,cb,fail){
            gm.network.request("guild.guildHandler.approve", {gid:id,reqId:reqId}, (data) => {
                var idx = gm.dataManage.guild.joinReq.indexOf(reqId);
                gm.dataManage.guild.joinReq.splice(idx, 1);
                gm.dataManage.guild.members.push(reqId);
                Util.invokeCallback(cb,data);
            },fail)
        }

        static reject(id,reqId,cb,fail){
            gm.network.request("guild.guildHandler.reject", {gid:id,reqId:reqId}, (data) => {
                var idx = gm.dataManage.guild.joinReq.indexOf(reqId);
                gm.dataManage.guild.joinReq.splice(idx, 1);
                Util.invokeCallback(cb,data);
            },fail)
        }

        static playerList(ids,cb,fail){
            gm.network.request("guild.guildHandler.playerList", {playerIds:ids}, (data) => {
                Util.invokeCallback(cb,data);
            },fail)
        }

        static quit(cb,fail){
            gm.network.request("guild.guildHandler.quit", {}, (data) => {
                gm.dataManage.data.guild = 0;
                Util.invokeCallback(cb,data);
            },fail)
        }

        static kick(id,memberId,cb,fail){
            gm.network.request("guild.guildHandler.kick", {gid:id,memberId:memberId}, (data) => {
                var idx = gm.dataManage.guild.members.indexOf(memberId);
                gm.dataManage.guild.members.splice(idx, 1);
                Util.invokeCallback(cb,data);
            },fail)
        }

        static setPresident(id,pid,name,cb,fail){
            gm.network.request("guild.guildHandler.setPresident", {gid:id,pid:pid,name:name}, (data) => {
                gm.dataManage.guild.president = pid;
                gm.dataManage.guild.presidentName = name;
                Util.invokeCallback(cb,data);
            },fail)
        }

        static buyGuildGold(cb,fail){
            var cost = gm.gameUI.getGuildTypeSource(consts.kGuildItemGoldRain).cost;
            if (!gm.dataManage.costMoney(cost, "crystal")) {
                Util.invokeCallback(fail);
                return false;
            }
            gm.network.sendAction("buyGuildGold", {}, function() {
                var gold = formula.goldRain(gm.dataManage.data);
                gm.dataManage.addMoney(gold, "gold");
                gm.postMessage(consts.kMessageGoldRain);
                Util.invokeCallback(cb,gold);
            }.bind(this),fail);
        }

        static buyGuildWeapon(cb,fail){
            var cost = gm.gameUI.getGuildTypeSource(consts.kGuildItemBox1).cost;
            if (!gm.dataManage.costMoney(cost, "crystal")) {
                Util.invokeCallback(fail);
                return false;
            }
            gm.network.sendAction("buyGuildWeapon", {}, function(data) {
                if(data.isWeapon){
                    gm.dataManage.addWeaponItem(1);
                } else {
                    gm.dataManage.addShopSkill(1,consts.kShopItemRefreshSkill);
                }
                Util.invokeCallback(cb,data.isWeapon);
            }.bind(this),fail);
        }

        static clearJoinReq(gid,cb,fail){
            gm.network.request("guild.guildHandler.clearJoinReq", {gid:gid}, (data) => {
                gm.dataManage.guild.joinReq = [];
                Util.invokeCallback(cb,data);
            },fail)
        }

        static setting(gid,icon,needReq,bpLimit,cb,fail){
            gm.network.request("guild.guildHandler.setting", {gid:gid,icon:icon,needReq:needReq,bpLimit:bpLimit}, () => {
                Util.invokeCallback(cb);
            },fail)
        }

        static envelopeList(gid,cb,fail){
            gm.network.request("guild.guildHandler.envelopeList", {gid:gid}, (data) => {
                gm.dataManage.guild.redEnvelope = data;
                Util.invokeCallback(cb,data);
            },fail)
        }

        static redEnvelope(type,cb,fail){
            var cost = Conf.redEnvelope[type].cost;
            if (!gm.dataManage.costMoney(cost, "diamond")) {
                Util.invokeCallback(fail);
                return ;
            }
            gm.network.sendAction("redEnvelope", {type:type}, function(data) {
                gm.dataManage.data.dailyEvent.envelope++;
                gm.dataManage.addItem(data.num,"crystal");
                Util.invokeCallback(cb,data);
            }.bind(this),fail);
        }

        static getEnvelope(idx,cb,fail){
            gm.network.sendAction("getEnvelope", {idx:idx}, function(data) {
                //var id = gm.dataManage.data.id;
                //var name = gm.dataManage.data.name || "英雄";
                //var avatar = gm.dataManage.data.avatar || "";
                //gm.dataManage.guild.redEnvelope[idx].list[id] = {name:name,avatar:avatar, num:data.diamond};
                gm.dataManage.addItem(data.diamond,"diamond");
                Util.invokeCallback(cb,data);
            }.bind(this),fail);
        }
    }
}