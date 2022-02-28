"use strict";
/**
 * Visualization map spatial data service R&D
 * @author Oran
 * @version 1.1
 * @time 2021/3/26
 */
(function (window) {
  /*************************************************** */
  window.webgl_debug = true; //域模式
  //'127.0.0.1:9731', '"+webgl_server_uri+"'
  window.webgl_server_uri = webgl_debug ? "127.0.0.1:9731" : "120.79.137.28:9732";
  window.webgl_server_models_url = webgl_debug ? "127.0.0.1:9730" : "120.79.137.28:9733";
  /*************************************************** */

  class qb_hght_webgl_ {
    constructor() {
      this.DynamicDraw = null;
      //滑动事件锁防止鼠标滑轮事件冲突
      this.SlidingRodChangeState = false;

      this.Rain = null; //雨
      this.Snow = null; //雪
      this.Fog = null; //雾

      //可视域分析
      this.VisualAnalysis_setvisible = VMSDS.util.VisualAnalysis();
      //html气泡
      this.MovePromptList = [];
      //html事件泛光
      this.event_spreadList = [];

      this.CabinetList = [
        { id: "143506267960670208", name: "1#所用变柜" },
        { id: "1428156867151982593", name: "2#站用变柜" },
        { id: "1435148518881800194", name: "#1泵LCU柜" },
        { id: "1435149385760550913", name: "#2泵LCU柜" },
        { id: "1435149753278050305", name: "#3泵LCU柜" },
        { id: "1435150089208246274", name: "#4泵LCU柜" },
        { id: "1435150511021010946", name: "#5泵LCU柜" },
        { id: "1435150764646379522", name: "#6泵LCU柜" },
        { id: "1435151005139382273", name: "#7泵LCU柜" },
        { id: "1435160241781125121", name: "1#10kv母线压变柜" },
        { id: "1435146812970283010", name: "1#10kv计量柜" },
        { id: "1435146512834277377", name: "1#10kv进线开关柜" },
        { id: "1435146244776308737", name: "1#10kv进线隔离柜" },
        { id: "1436241650620846082", name: "1#电动机柜" },
        { id: "1435137682490568705", name: "1#电容柜" },
        { id: "1436249160023048194", name: "125kvA进线柜" },
        { id: "1435143605468573698", name: "1AH1#进线隔离柜" },
        { id: "1435145126826520578", name: "2#10kv计量柜" },
        { id: "1435144190594953218", name: "2#10kv进线开关柜" },
        { id: "1436242019547631618", name: "2#电动机柜" },
        { id: "1435138026926813185", name: "2#电容柜" },
        { id: "1436244069891198978", name: "2#进线计量柜" },
        { id: "1436242275794440194", name: "3#电动机柜" },
        { id: "1435138273610608641", name: "3#电容柜" },
        { id: "1436242783905009665", name: "4#电动机柜" },
        { id: "1435138550698913793", name: "4#电容柜" },
        { id: "1435163084671987713", name: "4AH母线压变柜" },
        { id: "1436244966817955842", name: "5#10kv电动机柜" },
        { id: "1435134970092892162", name: "5#无功补偿柜" },
        { id: "1435136131504058370", name: "5#软启动柜" },
        { id: "1436246417724178434", name: "6#10kv电动机柜" },
        { id: "1435135259059466241", name: "6#无功补偿柜" },
        { id: "1435136473293697026", name: "6#软启动柜" },
        { id: "1436246731315511297", name: "7#10kv电动机柜" },
        { id: "1435135520914059265", name: "7#无功补偿柜" },
        { id: "1435136767373127681", name: "7#软启动柜" },
        { id: "1435086703497883649", name: "80kvA进线开关柜" }, //80kvA低压开关柜
        { id: "1428157646625632257", name: "低压联络柜" },
        { id: "1435090898376503298", name: "低压出线柜" }, //低压进线柜
        { id: "1436253107630669825", name: "公用LCU柜1" },
        { id: "1436255869214949378", name: "公用LCU柜2" },
        { id: "1436248542432755714", name: "出线柜" },
        { id: "1436243802906972162", name: "母联开关柜" },
        { id: "1436240666452578306", name: "母联隔离柜" },
        { id: "1436248844342951938", name: "电容柜" },
        { id: "1436256405360246785", name: "电源柜1" },
        { id: "1436256597237071873", name: "电源柜2" },
        { id: "1436254133616148481", name: "直流屏柜1" },
        { id: "1436255370143105026", name: "直流屏柜2" },
        { id: "1436253521369399297", name: "网络设备柜1" },
        { id: "1436256875919212545", name: "网络设备柜2" },
        { id: "1436254438437191682", name: "蓄电池柜1" },
        { id: "1436254901735817218", name: "蓄电池柜2" },
      ];

      // 1428159213999288321	供水系统

      window.data_popup_list = [
        {
          x: 120.26635947276584,
          y: 30.294950239547614,
          z: 13,
          id: "1436237362930700290",
          name: "1#皮带机",
          hpr: {
            h: 6.09,
            p: -1.2614823485,
            r: 6.28,
            x: 120.266361,
            y: 30.294891,
            z: 39.68,
            name: "1#皮带机",
          },
        },
        {
          x: 120.26667054117655,
          y: 30.29503913007729,
          z: 13,
          id: "1436238295605465089",
          name: "2#皮带机",
          hpr: {
            h: 5.86,
            p: -1.1954162771,
            r: 6.28,
            x: 120.266687,
            y: 30.294946,
            z: 39.32,
            name: "2#皮带机",
          },
        },

        {
          x: 120.26701685788548,
          y: 30.29412351210417,
          z: 13,
          id: "1435130443943948289",
          name: "自排闸启闭机",
          hpr: {
            h: 5.92,
            p: -1.2320704208,
            r: 6.28,
            x: 120.267167,
            y: 30.294038,
            z: 56.54,
            name: "自排闸启闭机",
          },
        },
        {
          x: 120.2670002815761,
          y: 30.29408829450894,
          z: 11,
          id: "1435128938058788865",
          name: "自排闸门",
          hpr: {
            h: 5.89,
            p: -0.4745122059,
            r: 6.28,
            x: 120.267167,
            y: 30.293661,
            z: 42.58,
            name: "自排闸门",
          },
        },
        {
          x: 120.26711210312837,
          y: 30.29415144897889,
          z: 13,
          id: "1435130143325597698",
          name: "大泵启闭机",
          hpr: {
            h: 5.88,
            p: -1.2320704236,
            r: 6.28,
            x: 120.267007,
            y: 30.29399,
            z: 56.52,
            name: "大泵启闭机",
          },
        },
        {
          x: 120.26706727049654,
          y: 30.294111064388176,
          z: 11,
          id: "1435128522109661185",
          name: "大泵闸门",
          hpr: {
            h: 5.89,
            p: -0.4745122052,
            r: 6.28,
            x: 120.267208,
            y: 30.293675,
            z: 42.59,
            name: "大泵闸门",
          },
        },
        {
          x: 120.26652988309702,
          y: 30.293772697078406,
          z: 13,
          id: "1435129452477591553",
          name: "小泵启闭机",
          hpr: {
            h: 6.23,
            p: -0.9867160435,
            r: 6.28,
            x: 120.26653,
            y: 30.293645,
            z: 42.52,
            name: "小泵启闭机",
          },
        },
        {
          x: 120.2665410491162,
          y: 30.293744683965798,
          z: 11,
          id: "1428158279927787522",
          name: "小泵闸门",
          hpr: {
            h: 6.27,
            p: -0.3612872039,
            r: 6.28,
            x: 120.266566,
            y: 30.293476,
            z: 28.38,
            name: "小泵闸门",
          },
        },

        {
          x: 120.26628980169093,
          y: 30.294605960134273,
          z: 15,
          id: "door_1",
          name: "大门气泡1",
          hpr: {
            h: 5.93,
            p: -0.3908401324,
            r: 6.28,
            x: 120.266345,
            y: 30.294473,
            z: 20.51,
            name: "大门气泡1",
          },
        },
        {
          x: 120.2663131965391,
          y: 30.294612729268934,
          z: 15,
          id: "door_2",
          name: "大门气泡2",
          hpr: {
            h: 5.93,
            p: -0.3908401324,
            r: 6.28,
            x: 120.266345,
            y: 30.294473,
            z: 20.51,
            name: "大门气泡2",
          },
        },
        {
          x: 120.266341775321,
          y: 30.29462022996924,
          z: 15,
          id: "door_3",
          name: "大门气泡3",
          hpr: {
            h: 5.93,
            p: -0.3908401324,
            r: 6.28,
            x: 120.266345,
            y: 30.294473,
            z: 20.51,
            name: "大门气泡3",
          },
        },

        {
          x: 120.26643624475356,
          y: 30.29488368755079,
          z: 10.460700769278687,
          id: "1435055590285029377",
          name: "泵体四号",
          hpr: {
            h: 2.71,
            p: -0.6664038317,
            r: 6.28,
            x: 120.266374,
            y: 30.294988,
            z: 20.98,
            name: "泵体一号",
          },
        },
        {
          x: 120.26639057662844,
          y: 30.2948778666848,
          z: 10.4659541057587876,
          id: "1435055173153107970",
          name: "泵体三号",
          hpr: {
            h: 2.71,
            p: -0.6664037144,
            r: 0,
            x: 120.266315,
            y: 30.29501,
            z: 24.39,
            name: "泵体二号",
          },
        },
        {
          x: 120.26634751704293,
          y: 30.29487163529706,
          z: 10.47115832267814,
          id: "1435054816809234433",
          name: "泵体二号",
          hpr: {
            h: 2.71,
            p: -0.6664037153,
            r: 0,
            x: 120.266279,
            y: 30.294979,
            z: 20.99,
            name: "泵体三号",
          },
        },
        {
          x: 120.26630450395568,
          y: 30.294865682357855,
          z: 10.46598014819476,
          id: "619534551667965952",
          name: "泵体一号",
          hpr: {
            h: 2.71,
            p: -0.6664037143,
            r: 0,
            x: 120.266215,
            y: 30.29501,
            z: 24.57,
            name: "泵体四号",
          },
        },
        {
          y: 30.294939,
          x: 120.266646,
          z: 10.4,
          id: "1435056521521180673",
          name: "泵体五号",
          hpr: {
            h: 2.51,
            p: -0.4281743832,
            r: 0,
            x: 120.266509,
            y: 30.295105,
            z: 22.51,
            name: "泵体五号",
          },
        },
        {
          y: 30.294953,
          x: 120.26669,
          z: 10.14,
          id: "1435057652284567554",
          name: "泵体六号",
          hpr: {
            h: 2.04,
            p: -0.573329604,
            r: 0,
            x: 120.266507,
            y: 30.295025,
            z: 24.72,
            name: "泵体六号",
          },
        },
        {
          y: 30.294971,
          x: 120.266738,
          z: 10.37,
          id: "1435058088999694337",
          name: "泵体七号",
          hpr: {
            h: 2.1,
            p: -0.6685758218,
            r: 0,
            x: 120.266544,
            y: 30.295051,
            z: 28.94,
            name: "泵体七号",
          },
        },

        {
          x: 120.26643624475356,
          y: 30.29488368755079,
          z: 10.4 - 2,
          id: "1435060296692576258",
          name: "电机4号",
          hpr: {
            h: 2.71,
            p: -0.6664038317,
            r: 6.28,
            x: 120.266374,
            y: 30.294988,
            z: 20.98,
            name: "电机1号",
          },
        },
        {
          x: 120.26639057662844,
          y: 30.2948778666848,
          z: 10.466 - 2,
          id: "1435059949139963905",
          name: "电机3号",
          hpr: {
            h: 2.71,
            p: -0.6664037144,
            r: 0,
            x: 120.266315,
            y: 30.29501,
            z: 24.39,
            name: "电机2号",
          },
        },
        {
          x: 120.26634751704293,
          y: 30.29487163529706,
          z: 10.4 - 2,
          id: "1435059261135695873",
          name: "电机2号",
          hpr: {
            h: 2.71,
            p: -0.6664037153,
            r: 0,
            x: 120.266279,
            y: 30.294979,
            z: 20.99,
            name: "电机3号",
          },
        },
        {
          x: 120.26630450395568,
          y: 30.294865682357855,
          z: 10.4 - 2,
          id: "1427479958642515970",
          name: "电机1号",
          hpr: {
            h: 2.71,
            p: -0.6664037143,
            r: 0,
            x: 120.266215,
            y: 30.29501,
            z: 24.57,
            name: "电机4号",
          },
        },
        {
          y: 30.294939,
          x: 120.266646,
          z: 10.4 - 2,
          id: "1435060827473358849",
          name: "电机5号",
          hpr: {
            h: 2.51,
            p: -0.4281743832,
            r: 0,
            x: 120.266509,
            y: 30.295105,
            z: 22.51,
            name: "电机5号",
          },
        },
        {
          y: 30.294953,
          x: 120.26669,
          z: 10.14 - 2,
          id: "1435061238053777410",
          name: "电机6号",
          hpr: {
            h: 2.04,
            p: -0.573329604,
            r: 0,
            x: 120.266507,
            y: 30.295025,
            z: 24.72,
            name: "电机6号",
          },
        },
        {
          y: 30.294971,
          x: 120.266738,
          z: 10.37 - 2,
          id: "1435061550537814017",
          name: "电机7号",
          hpr: {
            h: 2.1,
            p: -0.6685758218,
            r: 0,
            x: 120.266544,
            y: 30.295051,
            z: 28.94,
            name: "电机7号",
          },
        },

        {
          x: 120.26628832626051,
          y: 30.29496502261484,
          z: 10.37,
          id: "1435125432065241089",
          name: "清污机及拦污栅一",
          hpr: {
            h: 2.94,
            p: -0.8404652956,
            r: 0,
            x: 120.266248,
            y: 30.295127,
            z: 30.44,
            name: "清污机及拦污栅一",
          },
        },
        {
          x: 120.26633178414939,
          y: 30.294972513756846,
          z: 10.37,
          id: "1435125716640378882",
          name: "清污机及拦污栅二",
          hpr: {
            h: 2.94,
            p: -0.8404652956,
            r: 0,
            x: 120.266307,
            y: 30.295128,
            z: 30.44,
            name: "清污机及拦污栅二",
          },
        },
        {
          x: 120.2663718850256,
          y: 30.294978790876556,
          z: 10.37,
          id: "1435126152793468930",
          name: "清污机及拦污栅三",
          hpr: {
            h: 2.94,
            p: -0.8404652959,
            r: 0,
            x: 120.266348,
            y: 30.295132,
            z: 30.44,
            name: "清污机及拦污栅三",
          },
        },
        {
          x: 120.26641233987897,
          y: 30.29498589474864,
          z: 10.37,
          id: "1435126508797603842",
          name: "清污机及拦污栅四",
          hpr: {
            h: 2.94,
            p: -0.8404652962,
            r: 0,
            x: 120.266409,
            y: 30.295138,
            z: 30.44,
            name: "清污机及拦污栅四",
          },
        },
        {
          x: 120.26661385810868,
          y: 30.2950483575551,
          z: 10.37,
          id: "1435126942706741249",
          name: "清污机及拦污栅五",
          hpr: {
            h: 2.73,
            p: -0.8808179289,
            r: 0,
            x: 120.266577,
            y: 30.295182,
            z: 31.02,
            name: "清污机及拦污栅五",
          },
        },
        {
          x: 120.26665352384654,
          y: 30.295062048167633,
          z: 10.37,
          id: "1435127277844213761",
          name: "清污机及拦污栅六",
          hpr: {
            h: 2.73,
            p: -0.8808179294,
            r: 0,
            x: 120.266615,
            y: 30.295192,
            z: 31.02,
            name: "清污机及拦污栅六",
          },
        },
        {
          x: 120.26669574975885,
          y: 30.295077498382756,
          z: 10.37,
          id: "1435127627972128769",
          name: "清污机及拦污栅七",
          hpr: {
            h: 2.73,
            p: -0.8808179301,
            r: 0,
            x: 120.266651,
            y: 30.295204,
            z: 31.03,
            name: "清污机及拦污栅七",
          },
        },
      ];
      this.PumpBodyBuilding;
    }
    IntelligentRoamingDynamicLine(viewer, list) {
      var alp = 0.1;
      var num = 0;

      viewer.entities.add({
        type: "IntelligentRoaming",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(list),
          width: 26,
          material: new Cesium.PolylineGlowMaterialProperty({
            //发光线
            glowPower: 0.1,
            color: new Cesium.CallbackProperty(function () {
              if (!alp && !num) {
                console.log("1", alp);
              }
              if (num % 2 === 0) {
                alp -= 0.002;
              } else {
                alp += 0.002;
              }

              if (alp <= 0.2) {
                num++;
              } else if (alp >= 0.5) {
                num++;
              }
              return Cesium.Color.ORANGE.withAlpha(alp);
              //entity的颜色透明 并不影响材质，并且 entity也会透明
            }, false),
          }),
          clampToGround: false,
        },
      });
    }
    BubbleOffset() {
      var list = [
        {
          layer: "layer_1",
          x: 120.26614815187936,
          y: 30.29488059945772,
          z: 13,
          name: ["母联隔离柜", "1#所用变柜", "7#10kv电动机柜", "6#10kv电动机柜", "5#10kv电动机柜", "1#10kv母线压变柜", "1#10kv计量柜", "1#10kv进线开关柜", "1#10kv进线隔离柜"],
          heading: -36,
          count: 8,
          distance: 0.8 + +0.05,
          angle: -36,
        },
        {
          layer: "layer_1",
          x: 120.26611929018384,
          y: 30.294974415233177,
          z: 13,
          name: ["125kvA进线柜", "电容柜", "出线柜"],
          heading: -36 + 90,
          count: 2,
          distance: 0.8,
          angle: -36 + 90,
        },
        {
          layer: "layer_1",
          x: 120.26607739953215,
          y: 30.29495181383225,
          z: 13,
          name: ["5#无功补偿柜", "6#无功补偿柜", "7#无功补偿柜"],
          heading: -36 + 90,
          count: 2,
          distance: 1.2,
          angle: -36 + 90,
        },

        {
          layer: "layer_1",
          x: 120.26608702618968,
          y: 30.29502540524556,
          z: 13,
          name: ["5#软启动柜", "6#软启动柜", "7#软启动柜"],
          heading: -36,
          count: 2,
          distance: 1.3,
          angle: -36,
        },
        {
          layer: "layer_1",
          x: 120.2660598157264,
          y: 30.29501350706505,
          z: 13,
          name: ["1#电容柜", "2#电容柜", "3#电容柜", "4#电容柜"],
          heading: -36,
          count: 3,
          distance: 0.8,
          angle: -36,
        },
        {
          layer: "layer_1",
          x: 120.26602931143994,
          y: 30.29506261631896,
          z: 13,
          name: ["1AH1#进线隔离柜", "2#10kv进线开关柜", "2#10kv计量柜", "4AH母线压变柜", "1#电动机柜", "2#电动机柜", "3#电动机柜", "4#电动机柜", "2#站用变柜", "母联开关柜", "2#进线计量柜", ""],
          heading: -36,
          count: 10,
          distance: 0.8 + +0.07,
          angle: -36,
        },
        {
          layer: "layer_1",
          x: 120.26603243064658,
          y: 30.29515291424935,
          z: 13,
          name: ["80kvA进线开关柜", "低压出线柜", "低压联络柜"],
          heading: -36 - 90,
          count: 2,
          distance: 0.8 + 0.02,
          angle: -36,
        },

        {
          layer: "layer_2",
          x: 120.26611512806784,
          y: 30.29491837738297,
          z: 17.8,
          name: ["蓄电池柜1", "直流屏柜1", "#5泵LCU柜", "#6泵LCU柜", "#7泵LCU柜", "公用LCU柜1", "电源柜1", "电源柜2", "网络设备柜1", ""],
          heading: -36,
          count: 8,
          distance: 0.8 - 0.02,
          angle: -36,
        },
        {
          layer: "layer_2",
          x: 120.2659843338234,
          y: 30.295097583990646,
          z: 17.8,
          name: ["#4泵LCU柜", "#3泵LCU柜", "#2泵LCU柜", "#1泵LCU柜"],
          heading: -36 + 90,
          count: 3,
          distance: 0.8 + 0.02,
          angle: -36 + 90,
        },
        {
          layer: "layer_2",
          x: 120.26596986080976,
          y: 30.29511377001415,
          z: 17.8,
          name: ["公用LCU柜2", "网络设备柜2", "直流屏柜2", "蓄电池柜2"],
          heading: -36 + 90,
          count: 3,
          distance: 0.8 + 0.02,
          angle: -36 + 90,
        },
      ];

      for (let index = 0; index < list.length; index++) {
        const element = list[index];

        var c = {
          x: element.x,
          y: element.y,
          z: element.z,
          name: element.name[0],
          id: element.layer,
        };

        this.CabinetList.forEach(e => {
          if (e.name == element.name[0]) {
            // console.log(e.name,aaa++)
            var _hpr = new VMSDS.measure._PersonnelPositioning().getLonAndLat(element.x, element.y, element.angle, element.distance);
            window.data_popup_list.push({
              x: element.x,
              y: element.y,
              z: element.z,
              name: element.name[0],
              id: e.id,
              layer: element.layer,
              hpr: {
                h: 5.65,
                p: -1.4379486677,
                r: 6.27,
                x: _hpr.lon,
                y: _hpr.lat,
                z: element.z + 15,
                name: e.name,
              },
            });
          }
        });

        var xy_ = new VMSDS.measure._PersonnelPositioning().getLonAndLat(element.x, element.y, element.angle, element.distance);
        var b = {
          x: xy_.lon,
          y: xy_.lat,
          z: element.z,
          name: element.name[1],
          id: element.id,
        };

        this.CabinetList.forEach(e => {
          if (e.name == element.name[1]) {
            // console.log(e.name,aaa++)
            // VMSDS.core.generatingPoint(VMSDS.GIS, b,element.name[1]);
            var _hpr = new VMSDS.measure._PersonnelPositioning().getLonAndLat(xy_.lon, xy_.lat, element.angle, element.distance);

            window.data_popup_list.push({
              x: xy_.lon,
              y: xy_.lat,
              z: element.z,
              name: element.name[1],
              id: e.id,
              layer: element.layer,
              hpr: {
                h: 5.65,
                p: -1.4379486677,
                r: 6.27,
                x: _hpr.lon,
                y: _hpr.lat,
                z: element.z + 15,
                name: e.name,
              },
            });
          }
        });
        for (let i = 1; i < element.count; i++) {
          var _ = new VMSDS.measure._PersonnelPositioning().getLonAndLat(xy_.lon, xy_.lat, element.angle, element.distance);
          xy_ = _;
          var a = {
            x: xy_.lon,
            y: xy_.lat,
            z: element.z,
            name: element.name[i + 1],
            id: element.id,
          };
          this.CabinetList.forEach(e => {
            if (e.name == element.name[i + 1]) {
              // VMSDS.core.generatingPoint(VMSDS.GIS, a,element.name[i + 1]);
              var _hpr = new VMSDS.measure._PersonnelPositioning().getLonAndLat(xy_.lon, xy_.lat, element.angle, element.distance);
              window.data_popup_list.push({
                x: xy_.lon,
                y: xy_.lat,
                z: element.z,
                name: element.name[i + 1],
                id: e.id,
                layer: element.layer,
                hpr: {
                  h: 5.65,
                  p: -1.4379486677,
                  r: 6.27,
                  x: _hpr.lon,
                  y: _hpr.lat,
                  z: element.z + 15,
                  name: e.name,
                },
              });

              // console.log(xy_,e.name,aaa++)
            }
          });
        }
      }
    }
    OffsetCabinetLabel(viewer, value) {
      function drawText(style) {
        const text = style.text;
        var c = document.createElement("canvas");
        const d = (text + "").length * style.fontSize;
        c.width = d;
        c.height = style.fontSize;
        var ctx = c.getContext("2d");

        ctx.fillStyle = style.color;
        ctx.font = "bold " + style.fontSize + "px 微软雅黑"; //设置字体
        ctx.textBaseline = "hanging"; //在绘制文本时使用的当前文本基线
        //绘制文本
        ctx.fillText(text, 0, 0);
        return c;
      }

      var element = drawText({
        text: value.name,
        fontSize: 50,
      });
      var dimensions = new Cesium.Cartesian3(0.8, 0.2, 0.1);
      var positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(value.x, value.y, value.z);
      // var translateMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid);
      var scaleMatrix = Cesium.Matrix4.fromScale(dimensions);

      var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(value.heading), 0, 0);
      var translateMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(positionOnEllipsoid, hpr);

      var planeModelMatrix = new Cesium.Matrix4();

      Cesium.Matrix4.multiply(translateMatrix, scaleMatrix, planeModelMatrix);

      var planeGeometry = new Cesium.PlaneGeometry({
        vertexFormat: Cesium.MaterialAppearance.VERTEX_FORMAT,
      });
      var planeGeometryInstance = new Cesium.GeometryInstance({
        geometry: planeGeometry,
        modelMatrix: planeModelMatrix,
      });

      var material = Cesium.Material.fromType("Image");
      material.uniforms.image = element;

      var model = viewer.scene.primitives.add(
        new Cesium.Primitive({
          geometryInstances: planeGeometryInstance,
          appearance: new Cesium.MaterialAppearance({
            closed: false,
            //translucent: false,
            material: material,
          }),
        })
      );
      model.name = value.name;
      model.layer = value.layer;
    }

    //#region example拓展方法
    //抛出全部方法
    findProperties(obj, ...arg) {
      function getProperty(new_obj) {
        if (new_obj.__proto__ === null) {
          //说明该对象已经是最顶层的对象
          return [];
        }

        let properties = Object.getOwnPropertyNames(new_obj);

        let arr = [];

        arg.forEach(v => {
          const newValue = properties.filter(property => {
            return property.startsWith(v);
          });

          if (newValue.length > 0) {
            arr = arr.concat(newValue);
          }
        });

        return [...arr, ...getProperty(new_obj.__proto__)];
      }

      return getProperty(obj);
    }
    InterceptionAndmonitoring() {
      var open = window.XMLHttpRequest.prototype.open,
        send = window.XMLHttpRequest.prototype.send;

      function openReplacement(method, url, async, user, password) {
        this._url = url;
        return open.apply(this, arguments);
      }

      function sendReplacement(data) {
        if (this.onreadystatechange) {
          this._onreadystatechange = this.onreadystatechange;
        }

        // console.log('Request sent',  );
        if (this._url.indexOf("bin") != -1 || this._url.indexOf("gltf") != -1 || this._url.indexOf("glb") != -1) {
          $.toast({
            heading: "文件加载中",
            text: "文件可能较大，请耐心等待",
            position: "top-center",
            stack: false,
          });
        }

        this.onreadystatechange = onReadyStateChangeReplacement;
        return send.apply(this, arguments);
      }

      function onReadyStateChangeReplacement() {
        // console.log('Ready state changed to: ', this.readyState);

        if (this.readyState == 4)
          if (this._url.indexOf("bin") != -1 || this._url.indexOf("gltf") != -1 || this._url.indexOf("glb") != -1) {
            // $.toast({
            //     heading: '文件加载',
            //     text: "加载完成："+this._url,
            //     position: 'bottom-right',
            //     stack: false
            // })
            $.toast({
              heading: "加载完成",
              // text: "加载完成："+this._url,
              showHideTransition: "slide",
              position: "top-center",
              icon: "success",
            });
          }

        if (this._onreadystatechange) {
          return this._onreadystatechange.apply(this, arguments);
        }
      }

      window.XMLHttpRequest.prototype.open = openReplacement;
      window.XMLHttpRequest.prototype.send = sendReplacement;
    }
    //释放方法
    release() {
      VMSDS.core.findProperties(VMSDS.core, "").forEach(mod => {
        if (mod.indexOf("Release") != -1) {
          var e = eval("VMSDS.core." + mod);
          e(VMSDS.GIS);
        }
      });
    }
    //#endregion
    //#region Cesium核心方法
    //初始化地球0
    example_InitMap() {
      var _this = this;
      if (VMSDS.util.webglReport()) {
        //判断浏览器是否支持WebGL
        VMSDS.core.create3D({
          id: "mapBox",
          showGroundAtmosphere: true,
          debug: false,
          success: function (_viewer) {
            VMSDS.GIS = _viewer;
            _this.BubbleOffset();
            _viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

            // _viewer.scene.globe.show = false;
            // _viewer.scene.globe.depthTestAgainstTerrain = true;
            // _viewer.scene.globe.enableLighting = true;
            // //是否关闭大气效果
            // _viewer.scene.globe.showGroundAtmosphere = true;

            // _viewer.scene.sun.show = false; //在Cesium1.6(不确定)之后的版本会显示太阳和月亮，不关闭会影响展示
            // _viewer.scene.moon.show = false;
            // _viewer.scene.skyBox.show = false;//关闭天空盒，否则会显示天空颜色
            // _viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);

            // _viewer.scene.globe.show = false;
            VMSDS.GIS.scene.highDynamicRange = true;
            VMSDS.GIS.scene.globe.baseColor = new Cesium.Color.fromBytes(9, 21, 30, 1);
            // VMSDS.GIS.scene.sun.show = false; //在Cesium1.6(不确定)之后的版本会显示太阳和月亮，不关闭会影响展示
            VMSDS.GIS.scene.moon.show = false;
            // VMSDS.GIS.scene.skyBox.show = false;//关闭天空盒，否则会显示天空颜色
            VMSDS.GIS.scene.backgroundColor = new Cesium.Color.fromCssColorString("#fff0");
          },
        });
      } else {
        //提示用户浏览器不支持WebGL，需更换浏览器
      }
    }
    //加载底图
    example_addBaseLayer() {
      VMSDS.core.addBaseLayer(VMSDS.GIS, {
        name: "影像底图",
        type: "mapbox", //www_google sl_geoq
        layer: "blue", //satellite
        // crs: '4326',
        brightness: 1,
      });
      // VMSDS.core.addBaseLayer(VMSDS.GIS, { // 被墙了暂时无法使用
      //     name: '影像底图',
      //     type: 'tdt',
      //     layer: 'navigation',
      //     crs: '4326',
      //     brightness: 1
      // });
    }
    //移除底图
    example_removeBaseLayer() {
      VMSDS.core.removeBaseLayer(VMSDS.GIS, "影像底图");
    }
    //加载3d模型
    example_add3DTiles() {
      var uri = "/assets/model/";
      if (!webgl_debug) var uri = "/3D/assets/model/";
      if (!VMSDS.GIS) return;
      VMSDS.core.add3DTiles(
        VMSDS.GIS,
        {
          name: "杭州白膜",
          ca: false,
          id: "杭州白膜",
          url: uri + "hangzhobaimo/tileset.json",
          flyTo: false,
          height: 10,
        },
        {
          color: "color('white', 0.2)", //"",//rgb(19 30 73)
          show: true,
        }
      );
    }
    //加载倾斜摄影模型
    example_qxsy_add3DTiles() {
      VMSDS.core.add3DTiles(
        VMSDS.GIS,
        {
          name: "倾斜摄影",
          id: "倾斜摄影",
          url: "http://data.marsgis.cn/3dtiles/qx-shequ/tileset.json",
          flyTo: true,
          heightOffset: 116,
          height: 0,
        },
        {
          color: "color('white', 1)",
          show: true,
        }
      );
    }
    //加载/删除 可视域分析
    example_VisualAnalysis(type) {
      this.VisualAnalysis_setvisible(VMSDS.GIS, type);
    }
    //删除对应名称或对应图层对象
    example_remove3DTiles() {
      var id = "西安";
      var model = VMSDS.core.QueryModel_Scene(VMSDS.GIS, id);
      if (model == null) {
        $("#PublicBubble").width("264");
        $("#PublicBubble").height("calc(100% - 890px)");
        $("#PublicBubble .title").html("提示");
        $("#PublicBubble .details").html("未查询到为（" + id + "）的ID");
        if (!$("#PublicBubble").is(":visible")) {
          AustralianBubble();
        }
      } else VMSDS.core.remove3DTiles(VMSDS.GIS, model);
    }
    //隐藏显示Tiles模型
    example_HideDisplay3DTiles() {
      var id = "西安";
      var model = VMSDS.core.QueryModel_Scene(VMSDS.GIS, id);
      if (model == null) {
        $("#PublicBubble").width("264");
        $("#PublicBubble").height("calc(100% - 890px)");
        $("#PublicBubble .title").html("提示");
        $("#PublicBubble .details").html("未查询到为（" + id + "）的ID");
        if (!$("#PublicBubble").is(":visible")) {
          AustralianBubble();
        }
      } else model.show = model.show ? false : true; //VMSDS.core.hide3DTiles(VMSDS.GIS,model);
    }
    example_altitude() {
      //加载杭州高程地形
      var provider = new Cesium.CesiumTerrainProvider({
        url: "https://gs.crcr.top/HZ%E5%9C%B0%E5%BD%A2%E5%88%87%E7%89%87/%E5%9C%B0%E5%BD%A2%E5%88%87%E7%89%87/",
        requestWaterMask: true, //开启法向量
        requestVertexNormals: true, //开启水面特效
      });
      VMSDS.GIS.terrainProvider = provider;

      VMSDS.core.Location(VMSDS.GIS, {
        h: 0.05,
        p: -0.1104896608,
        r: 0,
        x: 120.114093,
        y: 30.172513,
        z: 449.74,
        duration: 3,
      });
    }
    //定位经纬度
    example_Location() {
      VMSDS.core.Location(VMSDS.GIS, {
        x: 108.96397,
        y: 34.21843,
        z: 17002,
        h: 0.06,
        p: -1.3671611507,
        r: 0,
        duration: 3,
      });
    }
    //添加gltf 或 gbl
    example_AddModels() {
      // $("#PublicBubble").width("264");
      // $("#PublicBubble").height("calc(100% - 890px)");
      // $("#PublicBubble .title").html("提示")
      // $("#PublicBubble .details").html("左键添加模型")
      // if(!$("#PublicBubble").is(":visible")){
      //     AustralianBubble()
      // }

      var viewer = VMSDS.GIS;
      var drawHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      var tooltip = new VMSDS.util.Tooltip(viewer);
      drawHandler.setInputAction(function (event) {
        tooltip.showAt(event.endPosition, "左键添加模型");
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      drawHandler.setInputAction(function (event) {
        var cartesian = viewer.scene.pickPosition(event.position);
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var lng = Cesium.Math.toDegrees(cartographic.longitude);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var height = cartographic.height + 10; //模型高度

        var arr_ = [
          "https://gs.crcr.top//models/山峰.glb",
          "https://gs.crcr.top//models/白膜建筑.glb",
          "https://gs.crcr.top//models/河流.glb",
          "https://gs.crcr.top//models/未来飞行器.glb",
          "https://gs.crcr.top//models/皇家公园.glb",
          "https://gs.crcr.top//models/千国.glb",
          "https://gs.crcr.top//models/火山.glb",
        ];
        var url = arr_[Math.floor(Math.random() * arr_.length)];
        console.log(url);
        VMSDS.core.AddModel(viewer, {
          url: url,
          scale: 1.0,
          x: lng,
          y: lat,
          z: height,
        });

        tooltip.setVisible(false);
        drawHandler.destroy();
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    //飞行小游戏
    example_FlyingGame() {
      setTimeout(() => {
        VMSDS.core.FlyingGame(VMSDS.GIS);
      }, 1000);
    }
    //获取相机坐标 附属方法
    getCameraPosition() {
      // 获取当前镜头位置的笛卡尔坐标
      let cameraPos = VMSDS.GIS.camera.position;
      // 获取当前坐标系标准
      let ellipsoid = VMSDS.GIS.scene.globe.ellipsoid;
      // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
      let cartographic = ellipsoid.cartesianToCartographic(cameraPos);
      // 获取镜头的高度
      let height = cartographic.height;
      return {
        cartographic,
        height,
      };
    }
    //#endregion
    //#region Cesium控件
    //导航控件
    example_addNavigation() {
      VMSDS.control.addNavigation(VMSDS.GIS, {
        x: 0,
        y: 0,
        z: 10000,
        heading: 0,
        pitch: 0,
        roll: 0,
      });
    }
    //添加鼠标位置控件
    example_addCoordinateBox() {
      //移动时会导致有点丢帧(已解决)
      VMSDS.control.addCoordinateBox(VMSDS.GIS, "mapbody");
    }

    //初始化二三维切换点击事件
    example_InitSwitchViews() {
      var _this = this;

      _this.example_Revolution("stop");
      $("#view-switch-spherical").click(function (event) {
        _this.example_SwitchViews("3D");
      });
      $("#view-switch-flat").click(function (event) {
        _this.example_SwitchViews("2D");
        // location.replace('./mapbox2d/index.html')
      });
    }
    //切换当前视图方式
    example_SwitchViews(value) {
      switch (value) {
        case "2D":
          if (VMSDS.GIS.scene.mode === Cesium.SceneMode.SCENE3D) {
            // VMSDS.GIS.scene.mode = Cesium.SceneMode.SCENE2D;
            VMSDS.GIS.scene.morphTo2D(2);
          }
          break;
        case "3D":
          if (VMSDS.GIS.scene.mode === Cesium.SceneMode.SCENE2D) {
            VMSDS.GIS.scene.morphTo3D(3);
            // VMSDS.GIS.scene.mode = Cesium.SceneMode.SCENE3D;
          }
          break;
      }
    }
    //初始化滑杆变动监听事件
    example_InitSlidingRodChange() {
      var max = 40000000;
      var _this = this;
      var handler = new Cesium.ScreenSpaceEventHandler(VMSDS.GIS.scene.canvas);
      //滚轮滚动 视角缩放事件
      handler.setInputAction(function (evnet) {
        //  $("#zoom-slider").find("span").prop("style").left
        // console.log(_this.getCameraPosition().height / max)
        // console.log("height" + (_this.getCameraPosition().height / max) * 100)
        //.css("width", "100px")
        var sliderZoom = (_this.getCameraPosition().height / max) * 100;
        sliderZoom = sliderZoom > 100 ? 100 : sliderZoom;
        $("#zoom-slider")
          .find("span")
          .css("left", sliderZoom + "%");

        $("#zoom-slider").attr("original-title", _this.getCameraPosition().height.toString().split(".")[0] + "米");

        _this.SlidingRodChangeState = true;
        setTimeout(() => {
          _this.SlidingRodChangeState = false;
        }, 1000);
      }, Cesium.ScreenSpaceEventType.WHEEL);
      var time = setInterval(() => {
        if ($("#zoom-slider").find("span")[0]) {
          var dom = document.getElementById("zoom-slider").getElementsByTagName("span")[0];
          let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
          let observer = new MutationObserver(mutationList => {
            //这里是观察到标签样式改变就会执行的函数
            var _this = this;

            if ($("#zoom-slider").find("span").prop("style") && !_this.SlidingRodChangeState) {
              var Camera = _this.getCameraPosition();
              $("#zoom-slider").attr("original-title", Camera.height.toString().split(".")[0] + "米");
              var percentage = $("#zoom-slider").find("span").prop("style").left.replace("%", "") / 100;
              percentage = percentage == 0 ? 0.0001 : percentage;
              // 根据上面当前镜头的位置，获取该中心位置的经纬度坐标
              let centerLon = parseFloat(Cesium.Math.toDegrees(Camera.cartographic.longitude).toFixed(8));
              let centerLat = parseFloat(Cesium.Math.toDegrees(Camera.cartographic.latitude).toFixed(8));
              // 镜头
              VMSDS.GIS.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, max * percentage),
                duration: 0.5,
              });
            }
          });
          observer.observe(dom, {
            attributes: true,
            attributeFilter: ["style"],
            attributeOldValue: true,
            childList: true,
            subtree: true,
          });

          clearInterval(time);
        }
      }, 100);
    }
    //初始化列表点击事件
    example_InitListEvents() {
      var _this = this;
      var time = setInterval(() => {
        if ($(".text").length > 3) {
          clearInterval(time);
          //demo.findProperties(demo, 'example_');
          for (let index = 0; index < $(".text").length; index++) {
            const element = $(".text")[index];
            if ("SPAN" === $(element).prop("nodeName") && $(element).html().split(".").length > 1) {
              $(element).click(function () {
                // console.log($(this).attr('id').split("-")[1])
                var modstate = false;
                _this.findProperties(_this, "example_").forEach(mod => {
                  if ($(this).attr("id").split("-")[1].split("(")[0] == mod) {
                    modstate = mod;
                  }
                });
                if (modstate != false) {
                  _this.release();
                  _this.example_Revolution("stop");
                  // console.log(Object.getPrototypeOf(_this)[modstate],($(element).attr('id').split("(")[1]).split(")")[0].replace(/'/g, ''))
                  // console.log( _this[Object.keys($(this).attr('id').split("-")[1].split("(")[0])[0]],$(this).attr('id').split("-")[1].split("(")[0])

                  Object.getPrototypeOf(_this)[modstate]($(element).attr("id").split("(")[1].split(")")[0].replace(/'/g, ""));
                  // eval("_this." + $(this).attr('id').split("-")[1]);
                } else {
                  //    width: 222px;  height: calc(100% - 890px);
                  $("#PublicBubble").width("264");
                  $("#PublicBubble").height("calc(100% - 890px)");
                  $("#PublicBubble .title").html("警告");
                  $("#PublicBubble .details").html("内置模组中查询不到 (" + $(element).attr("id").split("-")[1] + ") 方法");
                  if (!$("#PublicBubble").is(":visible")) {
                    AustralianBubble();
                  }
                }
              });
            }
          }
        }
      }, 100);
    }
    //#endregion
    //#region Cesium拓展模块
    //自转-旋转地球
    example_AutoRotate() {
      //    width: 222px;  height: calc(100% - 890px);
      $("#PublicBubble").width("264");
      $("#PublicBubble").height("calc(100% - 890px)");
      $("#PublicBubble .title").html("提示");
      $("#PublicBubble .details").html("双击绕点旋转/暂停");
      if (!$("#PublicBubble").is(":visible")) {
        AustralianBubble();
      }
      VMSDS.core.AutoRotate(VMSDS.GIS);
    }
    //公转-视角围绕地球旋转
    example_Revolution(type) {
      var setvisible = VMSDS.core.Revolution();
      setvisible(VMSDS.GIS, type == null ? "play" : type); //stop
    }
    //DepthDetection,//人物贴地行走
    example_DepthDetection() {
      var viewer = VMSDS.GIS;
      var scene = viewer.scene;
      var clock = viewer.clock;

      var entity;
      var positionProperty;
      var dataSourcePromise = Cesium.CzmlDataSource.load("./json/data/ClampToGround.czml");
      viewer.dataSources.add(dataSourcePromise).then(function (dataSource) {
        entity = dataSource.entities.getById("CesiumMilkTruck");
        positionProperty = entity.position;
        entity.model.scale = 0.1;
        console.log(entity.model.scale);
      });

      var tileset = VMSDS.core.add3DTiles(
        VMSDS.GIS,
        {
          name: "倾斜摄影",
          id: "倾斜摄影",
          url: "/assets/tileset/model/tileset.json",
          flyTo: true,
          heightOffset: -100,
          height: 0,
        },
        {
          color: "color('white', 1)",
          show: true,
        }
      );

      // var imagePath = '/assets/tileset/BING_SAT_WM.tif';
      // tileset.readyPromise.then(function() {
      //     var textureIndexToReplace = 0;
      //     var textures = model._rendererResources.textures;
      //     var texture = textures[textureIndexToReplace];
      //     Cesium.Resource.fetchImage({
      //         url : imagePath
      //     }).then(function(image) {
      //         texture.copyFrom(image);
      //         texture.generateMipmap(); // Also replaces textures in mipmap
      //     });
      // });

      if (scene.clampToHeightSupported) {
        tileset.initialTilesLoaded.addEventListener(start);
      } else {
        window.alert("This browser does not support clampToHeight.");
      }

      function start() {
        clock.shouldAnimate = true;
        var objectsToExclude = [entity];
        scene.postRender.addEventListener(function () {
          var position = positionProperty.getValue(clock.currentTime);
          entity.position = scene.clampToHeight(position, objectsToExclude);
        });
      }
    }
    //#endregion
    //#region 特效模块
    //日照分析
    example_runshineAnalysis() {
      var setvisible = VMSDS.effect.runshineAnalysis();
      setvisible(VMSDS.GIS, "play"); //stop
    }
    //大气特效
    example_AtmosphericEffects() {
      VMSDS.effect.AtmosphericEffects(VMSDS.GIS);
    }
    //全局发光
    example_bright() {
      VMSDS.effect.bright(VMSDS.GIS);
    }
    //着色器下雪
    example_snowSystem_Shaders() {
      this.Snow =
        this.Snow == null
          ? new VMSDS.effect.Effect(VMSDS.GIS, {
              visibility: 0.2,
              show: false,
              type: "x",
              color: new Cesium.Color.fromCssColorString("#e7e7e7"), //new Cesium.Color(0.8, 0.8, 0.8, 0.3)
            })
          : this.Snow; //雪
      if (!this.Snow._show) this.Snow.show(true);
      else this.Snow.show(false);
    }
    //着色器下雨
    example_RainwaterSystem_Shaders() {
      this.Rain =
        this.Rain == null
          ? new VMSDS.effect.Effect(VMSDS.GIS, {
              visibility: 0.2,
              show: false,
              type: "y",
              color: new Cesium.Color.fromCssColorString("#e7e7e7"), //new Cesium.Color(0.8, 0.8, 0.8, 0.3)
            })
          : this.Rain; //雨
      if (!this.Rain._show) this.Rain.show(true);
      else this.Rain.show(false);
    }
    //着色器雾
    example_Fogging() {
      this.Fog =
        this.Fog == null
          ? new VMSDS.effect.Effect(VMSDS.GIS, {
              visibility: 0.2,
              show: false,
              type: "w",
              color: new Cesium.Color.fromCssColorString("#e7e7e7"), //new Cesium.Color(0.8, 0.8, 0.8, 0.3)
            })
          : this.Fog; //雾
      if (!this.Fog._show) this.Fog.show(true);
      else this.Fog.show(false);
      // this.Fogging.destroy();
    }
    example_water() {
      var viewer = VMSDS.GIS;
      var arr = [
        { x: 120.26496792518007, y: 30.297521280067997, z: 16.5502864329248140893 },
        { x: 120.2650193951041, y: 30.297443388972095, z: 16.55029142425299503896 },
        { x: 120.2650878628649, y: 30.297340714428206, z: 16.55028543132697953286 },
        { x: 120.26515325470301, y: 30.297243232719616, z: 16.55028881044671174867 },
        { x: 120.26522603010162, y: 30.297136969614204, z: 16.550290301314247369 },
        { x: 120.26530390730775, y: 30.297015670666877, z: 16.55028469007364213144 },
        { x: 120.26536780811445, y: 30.29691851661306, z: 16.55029096051621271607 },
        { x: 120.26544960495134, y: 30.296794490833737, z: 16.5502864372594714142 },
        { x: 120.26553859801393, y: 30.29666919148809, z: 16.5511404836527121043 },
        { x: 120.2656462025158, y: 30.29651502217603, z: 16.550550080689704606 },
        { x: 120.26574441334185, y: 30.296356630772195, z: 16.5511311611265702316 },
        { x: 120.26584410392233, y: 30.29621545092209, z: 16.5510426668868341756 },
        { x: 120.26595271289617, y: 30.296049935684863, z: 16.5510391568249843418 },
        { x: 120.2660299389262, y: 30.295930010166025, z: 16.5511033897013522746 },
        { x: 120.26611277735896, y: 30.29579172006876, z: 16.55113965065796568 },
        { x: 120.26616272882114, y: 30.295710874248876, z: 16.551139413476470141 },
        { x: 120.26622994853884, y: 30.295596305178815, z: 16.5511108528389225125 },
        { x: 120.26631158501773, y: 30.29543838274942, z: 16.5510831855616639263 },
        { x: 120.26638431753918, y: 30.295294687905432, z: 16.5511406671835342901 },
        { x: 120.26644365936777, y: 30.29516786919579, z: 16.5511528365075681964 },
        { x: 120.26651656892115, y: 30.29500081953047, z: 16.5511152239854026408 },
        { x: 120.26655286529581, y: 30.294903417366058, z: 16.551067087474766538 },
        { x: 120.2665952444415, y: 30.29481309349594, z: 16.5510007131247718856 },
        { x: 120.26663007869543, y: 30.29473383205688, z: 16.5510160797397838982 },
        { x: 120.26666242897872, y: 30.29465672880607, z: 16.551050674930737183 },
        { x: 120.26670908281298, y: 30.29454646498085, z: 16.5511022555451730728 },
        { x: 120.26675594518004, y: 30.29444560534695, z: 16.5511275115089946993 },
        { x: 120.26680411302392, y: 30.29434447618602, z: 16.5511301987038766462 },
        { x: 120.2668466193003, y: 30.29426116654518, z: 16.551115616326384528 },
        { x: 120.26701021039688, y: 30.29431531797972, z: 16.5511480063180509712 },
        { x: 120.26703592516489, y: 30.29411177698039, z: 16.5505439154560807703 },
        { x: 120.26704783099146, y: 30.294066988505666, z: 16.5505588092686361646 },
        { x: 120.26707662263148, y: 30.293950472511405, z: 16.5505781448210175078 },
        { x: 120.26706501349875, y: 30.293504928213267, z: 16.5518526455770580446 },
      ];
      var list = [];
      for (let index = 0; index < arr.length; index++) {
        const e1 = arr[index];
        const e2 = arr[index + 1];
        if (e2 == null) {
          break;
        }
        // viewer.entities.add({
        //     polyline: {
        //         positions: Cesium.Cartesian3.fromDegreesArrayHeights([e1.x,e1.y,8,e2.x,e2.y,8]),
        //         width: 26,
        //         material : new Cesium.PolylineArrowMaterialProperty(Cesium.Color.BLUE),
        //         clampToGround: false
        //     }
        // })
        var a = [
          {
            longitude: e1.x,
            dimension: e1.y,
            height: 8,
          },
          {
            longitude: e2.x,
            dimension: e2.y,
            height: 8,
          },
        ];
        list.push(
          {
            longitude: e1.x,
            dimension: e1.y,
            height: 8,
          },
          {
            longitude: e2.x,
            dimension: e2.y,
            height: 8,
          }
        );
        var entity = LineMovement(viewer, a, {
          time: 2, //线条间隔速度
          stopTime: 3, //模型结束时间
          multiplier: 1, // 时间速率，数字越大时间过的越快
        });
        if (index % 2 == 0)
          entity.path = {
            show: true,
            leadTime: 0.5,
            width: 20,
            trailTime: 0.2,
            resolution: 0.1,
            material: new Cesium.PolylineGlowMaterialProperty({
              //发光线
              glowPower: 0.1,
              color: Cesium.Color.GREEN.withAlpha(0.1),
            }),
          };
      }

      //线条漫游
      function LineMovement(viewer, datas, options) {
        if (options.time != undefined) {
          for (let index = 0; index < datas.length; index++) {
            if (index >= 0) {
              datas[index].time = options.time * index;
            } else datas[index].time = 0;
          }
        }
        var cameraTimer = "04:00:00";
        //viewer.scene.globe.enableLighting = true;
        var hour = cameraTimer.split(":")[0];
        var min = cameraTimer.split(":")[1];
        var sec = cameraTimer.split(":")[2];
        var s = Number(hour * 3600) + Number(min * 60) + Number(sec); //加当前相机时间
        function formatTime(s) {
          var t;
          if (s > -1) {
            var hour = Math.floor(s / 3600);
            var min = Math.floor(s / 60) % 60;
            var sec = s % 60;
            if (hour < 10) {
              t = "0" + hour + ":";
            } else {
              t = hour + ":";
            }

            if (min < 10) {
              t += "0";
            }
            t += min + ":";
            if (sec < 10) {
              t += "0";
            }
            t += sec.toFixed(2);
          }
          return t;
        }
        cameraTimer = formatTime(s);
        function ISODateString(d) {
          function pad(n) {
            return n < 10 ? "0" + n : n;
          }
          return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + cameraTimer + "Z";
        }
        var curTime = ISODateString(new Date());

        // 起始时间
        let start = Cesium.JulianDate.fromDate(new Date(curTime));
        // 结束时间
        let stop = Cesium.JulianDate.addSeconds(start, options.stopTime, new Cesium.JulianDate());
        // 设置始时钟始时间
        viewer.clock.startTime = start.clone();
        // 设置时钟当前时间
        viewer.clock.currentTime = start.clone();
        // 设置始终停止时间
        viewer.clock.stopTime = stop.clone();
        // 时间速率，数字越大时间过的越快
        viewer.clock.multiplier = options.multiplier;
        // 时间轴
        viewer.timeline.zoomTo(start, stop);
        // 循环执行,即为2，到达终止时间，重新从起点时间开始
        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        /**
         * 计算飞行
         * @param source 数据坐标
         * @returns {SampledPositionProperty|*}
         */
        function computeFlight(start, source) {
          // 取样位置 相当于一个集合
          let property = new Cesium.SampledPositionProperty();
          for (let i = 0; i < source.length; i++) {
            let time = Cesium.JulianDate.addSeconds(start, source[i].time, new Cesium.JulianDate());
            let position = Cesium.Cartesian3.fromDegrees(source[i].longitude, source[i].dimension, source[i].height);
            // 添加位置，和时间对应
            property.addSample(time, position);
          }
          return property;
        }
        let property = computeFlight(start, datas);

        // 添加模型
        return viewer.entities.add({
          shapeType: "LineMovement",
          // 和时间轴关联
          availability: new Cesium.TimeIntervalCollection([
            new Cesium.TimeInterval({
              start: start,
              stop: stop,
            }),
          ]),
          position: property,
          // 根据所提供的速度计算模型的朝向
          orientation: new Cesium.VelocityOrientationProperty(property),
          // path: {
          //   show: true,
          //   leadTime: 0,
          //   trailTime: 60,
          //   width: 4,
          //   resolution: 1,
          //   // material: new Cesium.PolylineGlowMaterialProperty({
          //   //     glowPower: 0.3,
          //   //     taperPower: 0.3,
          //   //     color: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.BLUE),
          //   // }),
          //   material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.WHITE),
          //   clampToGround: false,
          // },
          // point: {
          //     pixelSize: 5,//大小
          //     color:Cesium.Color.RED,
          //     // outlineColor: Cesium.Color.RED,//边框颜色
          //     // outlineWidth: 3,//宽 边框
          //     // disableDepthTestDistance: Number.POSITIVE_INFINITY//防止被遮挡
          // },
        });
      }

      var _uri = "/core/";
      if (!webgl_debug) var _uri = "/3D/core/";

      var array = [
        { x: 120.26423034160987, y: 30.297508620981308, z: -0.0005481249938256232 },
        { x: 120.26904954130474, y: 30.29751150385871, z: -0.0005443505994433334 },
        { x: 120.26905168757906, y: 30.292162853325785, z: -0.0002859597184876232 },
        { x: 120.26425104776932, y: 30.292164102108764, z: -0.0002865974584816008 },
      ];
      //河道关键点数组
      var RiverPoint = [];
      array.forEach(element => {
        RiverPoint.push(element.x, element.y);
      });

      var polygon = viewer.scene.primitives.add(
        new Cesium.Primitive({
          geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.PolygonGeometry({
              polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(RiverPoint)),
              extrudedHeight: 5.2,
              height: 5.2,
              vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
            }),
          }),
          appearance: new Cesium.EllipsoidSurfaceAppearance({
            aboveGround: true,
            material: new Cesium.Material({
              fabric: {
                type: "Water",
                uniforms: {
                  baseWaterColor: new Cesium.Color.fromCssColorString("#fff").withAlpha(0.1), //new Cesium.Color.AQUA.withAlpha(0.1),082567
                  normalMap: Cesium.buildModuleUrl("Assets/Textures/waterNormals.jpg"),
                  frequency: 1000.0, //频率
                  animationSpeed: 0.01, //动画速度
                  amplitude: 10, //振幅
                },
              },
            }),
          }),
          show: true,
        })
      );
      ////_uri+"images/waterNormals.jpg"
    }

    //#endregion
    //建筑分层
    example_layered() {
      $("#PublicBubble").width("72%");
      $("#PublicBubble").height("61%");
      $("#PublicBubble").css("left", "9%");
      $("#PublicBubble").css("top", "20%");

      $("#PublicBubble .title").html("建筑分层DEMO");
      $("#PublicBubble .details").html(` <iframe id="eve" style="position: absolute;border: 1px solid #000;padding: 0;width: 97%;height: 89%;" src="example/Preview"></iframe>`);
      if (!$("#PublicBubble").is(":visible")) {
        AustralianBubble();
      }
    }

    //#region 绘制模块
    //画点
    example_drawPoint() {
      $("#PublicBubble").width("264");
      $("#PublicBubble").height("calc(100% - 890px)");
      $("#PublicBubble .title").html("提示");
      $("#PublicBubble .details").html("单击鼠标，右键结束画点");
      if (!$("#PublicBubble").is(":visible")) {
        AustralianBubble();
      }
      VMSDS.core.drawPoint(VMSDS.GIS, function (id) {
        console.log(id);
      });
    }
    //初始化绘制类
    initDynamicDraw() {
      this.DynamicDraw = new VMSDS.DynamicDraw.DynamicDrawer(VMSDS.GIS, {
        id: VMSDS.core.uuid(),
        _style: {
          labelTransparency: 100, //字体透明度
          outlineColor: "#3462d0", //字体边框颜色
          fillColor: "#fff", //字体颜色
          PolylineColor: "#fff",
          PolylineWitch: 3, //线条宽度
          shapeColor: "#fff",
          shapeTransparency: 50, //形状透明度
          borderWitch: 2, //边框宽度
          borderColor: "#3462d0",
          borderTransparency: 80, //边框透明度
        },
      });
    }
    //画
    example_DynamicDraw(type) {
      this.initDynamicDraw();
      function _(positions) {
        var p = [];
        positions.forEach(element => {
          var cartographic = Cesium.Cartographic.fromCartesian(element);
          var lng = Cesium.Math.toDegrees(cartographic.longitude);
          var lat = Cesium.Math.toDegrees(cartographic.latitude);
          var height = cartographic.height; //模型高度
          var mapPosition = { x: lng, y: lat, z: height };

          p.push(mapPosition);
        });
        return p;
      }

      switch (type) {
        case "drawPolyline": //画折线
          this.DynamicDraw.drawPolyline(function (positions) {
            console.log(_(positions));
          });
          break;
        case "drawPolygon": //画多边形
          this.DynamicDraw.drawPolygon(function (positions) {
            console.log(_(positions));
          });
          break;
        case "drawRectangle": //画矩形
          this.DynamicDraw.drawRectangle(function (positions) {
            console.log(_(positions));
          });
          break;
        case "drawCircle": //画圆
          this.DynamicDraw.drawCircle(function (positions) {
            console.log(_(positions));
          });
          break;

        default:
          break;
      }
    }
    //初始化绘制类
    initmeasureDraw() {
      this.DynamicDraw = new VMSDS.DynamicDraw.DynamicDrawer(VMSDS.GIS, {
        id: VMSDS.core.uuid(),
        type: "测量", //默认为空就是绘制
        _style: {
          backgroundColor: "#000",
          labelTransparency: 80, //字体透明度
          outlineColor: "#fff", //字体边框颜色3462d0
          fillColor: "#fff", //字体颜色
          PolylineColor: "#fff",
          PolylineWitch: 3, //线条宽度
          shapeColor: "#fff",
          shapeTransparency: 50, //形状透明度
          borderWitch: 2, //边框宽度
          borderColor: "#3462d0",
          borderTransparency: 80, //边框透明度
        },
      });
    }
    //测
    example_measureDraw(type) {
      this.initmeasureDraw();
      switch (type) {
        case "drawPolyline": //测折线
          this.DynamicDraw.drawPolyline(function (positions) {
            console.log(positions);
          });
          break;
        case "drawPolygon": //测多边形
          this.DynamicDraw.drawPolygon(function (positions) {
            console.log(positions);
          });
          break;
        default:
          break;
      }
    }
    //测高
    example_measureLineFlat() {
      VMSDS.measure.measureHeight(VMSDS.GIS);
    }
    //删除测高
    example_deleteAltimetry() {
      VMSDS.measure.deleteAltimetry(VMSDS.GIS);
    }
    //编辑图形
    example_editEntity() {
      this.DynamicDraw.setMode(1);
    }
    //删除图形
    example_deleteEntity() {
      this.DynamicDraw.setMode(2);
    }
    //#endregion
    //#region 工具类
    //投放视频
    example_DropView() {
      VMSDS.core.add3DTiles(
        VMSDS.GIS,
        {
          name: "倾斜摄影",
          id: "倾斜摄影",
          url: "http://data.marsgis.cn/3dtiles/qx-shequ/tileset.json",
          flyTo: true,
          heightOffset: 116,
          height: 0,
        },
        {
          color: "color('white', 1)",
          show: true,
        }
      );

      var viewer = VMSDS.GIS;
      VMSDS.control.DropView(viewer);
    }
    /**
     * 获取视角
     */
    example_getCameraView() {
      var x = new VMSDS.util.getCameraView(VMSDS.GIS);
      console.log(x);
    }
    /**
     * 地下模式
     */
    example_perspective() {
      var viewer = VMSDS.GIS;
      VMSDS.core.perspective(viewer);

      var longitude = -3.82518;
      var latitude = 53.11728;
      var height = -15.8;
      var position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
      var url = "https://gs.crcr.top/models/%E5%9C%B0%E4%B8%8B/scene.gltf";

      var entity = viewer.entities.add({
        name: url,
        position: position,
        model: {
          uri: url,
        },
      });

      // setInterval(() => {
      //     console.log(VMSDS.core.QueryModel_Entities_Name(VMSDS.GIS,url))
      //     console.log(entity.isShowing)
      // }, 100);

      VMSDS.core.Location(VMSDS.GIS, {
        h: 3.8,
        p: -0.5138722284,
        r: 6.28,
        x: -3.813843,
        y: 53.12458,
        z: 233.03,
        duration: 3,
      });
    }
    /**
     * 淹没分析
     *
     */
    example_flood() {
      //加载杭州高程地形
      var provider = new Cesium.CesiumTerrainProvider({
        url: "https://gs.crcr.top/HZ%E5%9C%B0%E5%BD%A2%E5%88%87%E7%89%87/%E5%9C%B0%E5%BD%A2%E5%88%87%E7%89%87/",
        requestWaterMask: true, //开启法向量
        requestVertexNormals: true, //开启水面特效
      });
      VMSDS.GIS.terrainProvider = provider;

      var viewer = VMSDS.GIS;
      var list = [
        120.10261959093359, 30.204485527057564, 0, 120.10709920718183, 30.207254370290435, 0, 120.11228753216636, 30.2082535788646, 0, 120.11308161984591, 30.201741853041703, 0, 120.11320008021373, 30.197917713164696, 0, 120.1083938247642, 30.197157355678932, 0, 120.10472587514137,
        30.196435231222196, 0, 120.10222312573894, 30.199601500815483, 0, 120.10084370896203, 30.202590708411343, 0,
      ];

      VMSDS.core.flood(viewer, list);
      VMSDS.core.Location(VMSDS.GIS, {
        h: 6.14,
        p: -0.9827765289,
        r: 6.28,
        x: 120.109299,
        y: 30.193515,
        z: 1390.7,
        duration: 3,
      });
    }
    /**
     * 立体墙（电子围栏）
     */
    example_SolidWall() {
      var viewer = VMSDS.GIS;

      var list = [118.8375696084184, 32.069033962622385, 50, 118.83688055322006, 32.0689229288966, 50, 118.83644644446449, 32.069488192538714, 50, 118.83649896141756, 32.07018963028347, 50, 118.83695815919243, 32.070910097520276, 50, 118.83759797480035, 32.07100091825888, 50];
      var list2 = [118.83506541379896, 32.06946848134058, 118.83400513813181, 32.07002251420361, 118.83347418449806, 32.07089995100669, 118.83438331952279, 32.07193067470218, 118.83535257138372, 32.07210429147912, 118.83589356127698, 32.07203052186791, 118.8363552617095, 32.07160094823974];

      // window.VMSDS.effect.SolidWall(viewer,"呼吸",list);
      // window.VMSDS.effect.SolidWall(viewer,"着色器1",list2);

      viewer = new Cesium.Viewer("cesiumContainer", {
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        infoBox: false,
        navigationInstructionsInitiallyVisible: false,
      });

      VMSDS.core.Location(VMSDS.GIS, {
        h: 3.8,
        p: -0.5138722284,
        r: 6.28,
        x: 118.838979,
        y: 32.073514,
        z: 233.03,
        duration: 3,
      });
    }
    /**
     * 动态线
     */
    example_DynamicLine() {
      var viewer = VMSDS.GIS;
      var list = [122.71199297693924, 32.43387210502884, 123.03324789347508, 32.62947331761125, 123.11671190443914, 32.37317576783303, 122.71080875610257, 32.43411322484099];
      viewer.zoomTo(window.VMSDS.effect.DynamicLine(viewer, list));
    }
    /**
     * 添加热力图
     */
    example_DistributionMap() {
      // 生成len个随机数据
      function getData(len) {
        //构建一些随机数据点
        var points = [];
        var max = 0;
        var width = 1000;
        var height = 1000;
        while (len--) {
          var val = Math.floor(Math.random() * 1000);
          max = Math.max(max, val);
          var point = {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height),
            value: val,
          };
          points.push(point);
        }
        return { max: max, data: points };
      }

      var coordinate = [-109.0, 10.0, -80.0, 35.0];
      VMSDS.util.DistributionMap(VMSDS.GIS, getData(100).max, getData(500).data, coordinate);

      VMSDS.core.Location(VMSDS.GIS, {
        h: 0.06,
        p: -1.366797227,
        r: 0,
        x: -89.937798,
        y: 13.015765,
        z: 5215387.73,
        duration: 3,
      });
    }
    //建筑分层
    example_BuildingStratification() {
      $("#mapBox").append(`<div class="tree well infoview" style="visibility: hidden;max-height: 666px;overflow: auto;-ms-overflow-style: none;scrollbar-width: none;">
                <ul>
                    <li id="tree_ul">
                        <span><i class="icon-folder-open"></i> 七堡排洪站</span> 
                    </li>
                </ul>
            </div>`);

      var BuildingData;
      //#region 加载建筑信息

      var settings = {
        //http://127.0.0.1:9730/Dimensional/GetBuildingStructure
        url: "http://" + webgl_server_models_url + "/Dimensional/GetBuildingStructure",
        method: "GET",
        timeout: 0,
        async: false,
      };
      $.ajax(settings).done(function (data) {
        data = data.datas[0].Routefile.file3Dtiles;

        const SWSB_PID = "13";

        const SWSB = {
          id: "90",
          pId: SWSB_PID,
          name: "室外设备",
          site: "",
          children: Array(1),
        };
        const SNSB = {
          id: "91",
          pId: SWSB_PID,
          name: "室内设备",
          site: "",
          children: Array(1),
        };
        const Top_1 = {
          id: "92",
          pId: SNSB.id,
          name: "中控大楼",
          site: "",
          children: Array(1),
        };
        const C_1 = {
          id: "93",
          pId: Top_1.id,
          name: "一层设备",
          site: "",
          children: Array(1),
        };
        const C_2 = {
          id: "94",
          pId: Top_1.id,
          name: "二层设备",
          site: "",
          children: Array(1),
        };

        data.push(SWSB, SNSB, Top_1, C_1, C_2);

        var ZKDL_PID, YGSS_PID;
        data.forEach(element => {
          if (decodeURI(element.site).indexOf("/SB/") != -1) {
            if (element.id != SWSB_PID) {
              element.name = decodeURI(element.site).split("/SB/")[1].split("/")[0] + "-" + decodeURI(element.site).split("/SB/")[1].split("/")[1];
              element.pId = SWSB.id;
            }
          }
          switch (element.name) {
            case "7号楼":
              element.name = "职工宿舍";
              YGSS_PID = element.id;
              break;
            case "6号楼":
              element.name = "水位站";
              break;
            case "5号楼":
              element.name = "地下室";
              break;
            case "4号楼":
              element.name = "临江杂物间";
              break;
            case "3号楼":
              element.name = "临江配电室";
              break;
            case "2号楼":
              element.name = "临江匝道室";
              break;
            case "1号楼":
              element.name = "中控大楼";
              ZKDL_PID = element.id;
              break;
            default:
              break;
          }
        });
        data.forEach(element => {
          if (element.pId == ZKDL_PID) {
            switch (element.name) {
              case "1":
                element.name = "一层";
                break;
              case "2":
                element.name = "二层";
                break;
              case "3":
                element.name = "屋顶";
                break;
              default:
                break;
            }
          }
        });
        VMSDS.GIS.building = data;
        var px = [];
        for (let index = 0; index < data.length; index++) {
          const element = data[index];

          if (element.site != null && element.site != "") {
            var mod = VMSDS.core.add3DTiles(
              VMSDS.GIS,
              {
                // name: "模型",
                id: element.id,
                url: element.site.replace("127.0.0.1:9731", webgl_server_uri), //gis.crcr.top:9732
                flyTo: false, //视野转跳
                height: 10,
              },
              {
                color: "color('white', 1)",
                show: true,
              }
            );
            mod.name = "七堡";
            mod.element = element;

            //非主要建筑 修改透明度
            if (element.pId == YGSS_PID) {
              var defaultStyle = new Cesium.Cesium3DTileStyle({
                color: "color('white', 0.5)",
              });
              mod.style = defaultStyle;
            }
          }

          if (decodeURI(element.site).indexOf("室内/") != -1) {
            data[index].name = data[index].name + "层";
          }

          if (decodeURI(element.site).indexOf("设备") != -1) {
            if (data[index].name.split("/").length > 1) {
              var name1 = data[index].name.split("/")[0];
              var name2 = data[index].name.split("/")[1];
              if (name1 == 1) {
                data[index].pId = C_1.id;
              } else {
                data[index].pId = C_2.id;
              }
              data[index].name = name1 + "层 - 设备" + name2;
              px.push({
                index: index,
                data: data[index],
                name1: Number(name1),
                name2: Number(name2),
              });
            }
          }
        }
        var n1 = [];
        var n2 = [];
        function px_() {
          for (let index = 0; index < px.length; index++) {
            const e = px[index];
            if (e.name1 == 1) {
              n1.push(e);
            }
            if (e.name1 == 2) {
              n2.push(e);
            }
          }
        }
        px_();
        var compare = function (prop) {
          return function (obj1, obj2) {
            var val1 = obj1[prop];
            var val2 = obj2[prop];
            if (val1 < val2) {
              return -1;
            } else if (val1 > val2) {
              return 1;
            } else {
              return 0;
            }
          };
        };
        n1 = n1.sort(compare("name2"));
        n2 = n2.sort(compare("name2"));

        var n1_min = Math.min.apply(
          Math,
          n1.map(function (o) {
            return o.index;
          })
        );
        for (let i = 0; i < n1.length; i++) {
          n1[i].index = n1_min + i;
        }
        var n2_min = Math.min.apply(
          Math,
          n2.map(function (o) {
            return o.index;
          })
        );
        for (let i = 0; i < n2.length; i++) {
          n2[i].index = n2_min + i;
        }
        n1.forEach(element => {
          data[element.index] = element.data;
        });
        n2.forEach(element => {
          data[element.index] = element.data;
        });
        BuildingData = data;
      });
      // console.log(BuildingData)
      VMSDS.core.Location(VMSDS.GIS, {
        h: 5.66,
        p: -0.4613129741,
        r: 6.28,
        x: 120.268602,
        y: 30.291957,
        z: 184.25,
        duration: 0,
      });
      //#endregion

      function makeTree(parentObj, treeJson) {
        var ulObj = $(`<ul></ul>`);
        for (var i = 0; i < treeJson.length; i++) {
          var childHtml = `<li style="display: none;">`;
          var aHtml;

          var str = treeJson[i].name;
          var shapeType;

          if (str.indexOf("DX") != -1) {
            shapeType = "地面";
          } else if (str.indexOf("SB") != -1) {
            shapeType = "设备";
          } else if (str.indexOf("JZSW") != -1) {
            shapeType = "室外建筑";
          } else if (str.indexOf("JZ") != -1) {
            shapeType = "建筑";
          } else if (str.indexOf("LH") != -1) {
            shapeType = "绿化";
          } else if (str.indexOf("XP") != -1) {
            shapeType = "其他";
          } else {
            shapeType = str;
          }
          // if(str.indexOf("设备") != -1){
          //     shapeType = "设备"
          // }
          if (treeJson[i].site != "") {
            aHtml = `<span><i  class="icon-minus-sign" data-id="` + treeJson[i].id + `"></i> ` + shapeType + `</span>  <a id="` + treeJson[i].id + `" onclick="treeOnclick(this)"  href="#">可视</a>`;
          } else {
            aHtml = `<span><i  class="icon-minus-sign" data-id="` + treeJson[i].id + `"></i> ` + shapeType + `</span>`;
          }
          childHtml += aHtml;
          childHtml += "</li>";

          if (treeJson[i].id != null && treeJson[i].id != "5") {
            var childObj = $(childHtml);
            if (treeJson[i].children != null && treeJson[i].children.length > 0) {
              makeTree(childObj, treeJson[i].children);
            }
            $(ulObj).append(childObj);
          }
        }
        $(parentObj).append($(ulObj));
      }

      function toTree(data) {
        let result = [];
        if (!Array.isArray(data)) {
          return result;
        }
        data.forEach(item => {
          delete item.children;
        });
        let map = {};
        data.forEach(item => {
          map[item.id] = item;
        });
        data.forEach(item => {
          let parent = map[item.pId];
          if (parent) {
            (parent.children || (parent.children = [])).push(item);
          } else {
            result.push(item);
          }
        });
        return result;
      }
      var tree = toTree(BuildingData);
      makeTree($("#tree_ul"), tree);

      $(function () {
        $(".tree li:has(ul)").addClass("parent_li").find(" > span").attr("title", "Collapse this branch");
        $(".tree li.parent_li > span").on("click", function (e) {
          var children = $(this).parent("li.parent_li").find(" > ul > li");
          if (children.is(":visible")) {
            children.hide("fast");
            $(this).attr("title", "Expand this branch").find(" > i").addClass("icon-plus-sign").removeClass("icon-minus-sign");
          } else {
            children.show("fast");
            $(this).attr("title", "Collapse this branch").find(" > i").addClass("icon-minus-sign").removeClass("icon-plus-sign");
          }
          e.stopPropagation();
        });
      });

      this.addNameBox();
      return BuildingData;
    }
    //柜体名称
    addNameBox() {
      var viewer = VMSDS.GIS;
      var list = [
        {
          layer: "layer_1",
          x: 120.26614815187936,
          y: 30.29488059945772,
          z: 13,
          name: ["母联隔离柜", "1#所用变柜", "7#10kv电动机柜", "6#10kv电动机柜", "5#10kv电动机柜", "1#10kv母线压变柜", "1#10kv计量柜", "1#10kv进线开关柜", "1#10kv进线隔离柜"],
          heading: -36,
          count: 8,
          distance: 0.8 + +0.05,
          angle: -36,
        },
        {
          layer: "layer_1",
          x: 120.26611929018384,
          y: 30.294974415233177,
          z: 13,
          name: ["125kvA进线柜", "电容柜", "出线柜"],
          heading: -36 + 90,
          count: 2,
          distance: 0.8,
          angle: -36 + 90,
        },
        {
          layer: "layer_1",
          x: 120.26607739953215,
          y: 30.29495181383225,
          z: 13,
          name: ["5#无功补偿柜", "6#无功补偿柜", "7#无功补偿柜"],
          heading: -36 + 90,
          count: 2,
          distance: 1.2,
          angle: -36 + 90,
        },

        {
          layer: "layer_1",
          x: 120.26608702618968,
          y: 30.29502540524556,
          z: 13,
          name: ["5#软启动柜", "6#软启动柜", "7#软启动柜"],
          heading: -36,
          count: 2,
          distance: 1.3,
          angle: -36,
        },
        {
          layer: "layer_1",
          x: 120.2660598157264,
          y: 30.29501350706505,
          z: 13,
          name: ["1#电容柜", "2#电容柜", "3#电容柜", "4#电容柜"],
          heading: -36,
          count: 3,
          distance: 0.8,
          angle: -36,
        },
        {
          layer: "layer_1",
          x: 120.26602931143994,
          y: 30.29506261631896,
          z: 13,
          name: ["1AH1#进线隔离柜", "2#10kv进线开关柜", "2#10kv计量柜", "4AH母线压变柜", "1#电动机柜", "2#电动机柜", "3#电动机柜", "4#电动机柜", "2#站用变柜", "母联开关柜", "2#进线计量柜", ""],
          heading: -36,
          count: 10,
          distance: 0.8 + +0.07,
          angle: -36,
        },
        {
          layer: "layer_1",
          x: 120.26603243064658,
          y: 30.29515291424935,
          z: 13,
          name: ["80kvA进线开关柜", "低压出线柜", "低压联络柜"],
          heading: -36 - 90,
          count: 2,
          distance: 0.8 + 0.02,
          angle: -36,
        },

        {
          layer: "layer_2",
          x: 120.26611512806784,
          y: 30.29491837738297,
          z: 17.8,
          name: ["蓄电池柜1", "直流屏柜1", "#5泵LCU柜", "#6泵LCU柜", "#7泵LCU柜", "公用LCU柜1", "电源柜1", "电源柜2", "网络设备柜1", ""],
          heading: -36,
          count: 8,
          distance: 0.8 - 0.02,
          angle: -36,
        },
        {
          layer: "layer_2",
          x: 120.2659843338234,
          y: 30.295097583990646,
          z: 17.8,
          name: ["#4泵LCU柜", "#3泵LCU柜", "#2泵LCU柜", "#1泵LCU柜"],
          heading: -36 + 90,
          count: 3,
          distance: 0.8 + 0.02,
          angle: -36 + 90,
        },
        {
          layer: "layer_2",
          x: 120.26596986080976,
          y: 30.29511377001415,
          z: 17.8,
          name: ["公用LCU柜2", "网络设备柜2", "直流屏柜2", "蓄电池柜2"],
          heading: -36 + 90,
          count: 3,
          distance: 0.8 + 0.02,
          angle: -36 + 90,
        },
      ];

      // console.log(new VMSDS.measure._PersonnelPositioning().getLonAndLat(
      //     list[list.length - 1].x,list[list.length - 1].y,
      //     list[list.length - 1].angle,0.1
      // ))

      // count = 8;//平移次数
      // distance = 0.8;//偏移距离
      // angle=-36;//旋转角
      for (let index = 0; index < list.length; index++) {
        const element = list[index];

        this.OffsetCabinetLabel(VMSDS.GIS, {
          x: element.x,
          y: element.y,
          z: element.z,
          name: element.name[0],
          heading: element.heading,
          layer: element.layer,
        });
        var xy_ = new VMSDS.measure._PersonnelPositioning().getLonAndLat(element.x, element.y, element.angle, element.distance);
        this.OffsetCabinetLabel(VMSDS.GIS, {
          x: xy_.lon,
          y: xy_.lat,
          z: element.z,
          name: element.name[1],
          heading: element.heading,
          layer: element.layer,
        });
        for (let i = 1; i < element.count; i++) {
          var _ = new VMSDS.measure._PersonnelPositioning().getLonAndLat(xy_.lon, xy_.lat, element.angle, element.distance);
          xy_ = _;
          this.OffsetCabinetLabel(VMSDS.GIS, {
            x: xy_.lon,
            y: xy_.lat,
            z: element.z,
            name: element.name[i + 1],
            heading: element.heading,
            layer: element.layer,
          });
        }
      }

      // QIBAO.SingleClickEvent(function (e) {
      //  console.log(e)
      // })
    }
    //选点漫游
    PointSelectionRoaming(value) {
      var setvisible = VMSDS.effect.runshineAnalysis();
      setvisible(VMSDS.GIS, "play"); //stop
      var _this = this;
      const viewer = VMSDS.GIS;
      var timer = value.timer == null ? 10 : value.timer; //模型行走数度

      var FineBezierTimer = value.FineBezierTimer == null ? 0.01 : value.FineBezierTimer; //算法路径速度

      var multiplier = value.multiplier == null ? 1 : value.multiplier; //当前世界速度 (可整体提高行走速度 必要也可以暂停模型)

      var nodeTime = value.nodeTime == null ? 0 : value.nodeTime * 1000; //节点停留时间

      viewer.RoamingStatus == true; //漫游防冲突

      viewer.characterBehavior = false;
      window.mousePosition = function (ev) {
        //漫游防冲突
        return {
          // IE浏览器
          x: 0,
          y: 0,
        };
      };
      Processing_layering(1);

      var xyList = [
        //二层
        [
          { type: "", x: 120.2660368451607, y: 30.29511702210979, z: 15.4 },
          { type: "key", x: 120.2660012287198, y: 30.29509367822525, z: 15.4 },
          { type: "", x: 120.26601760723695, y: 30.295109004174265, z: 15.4 },
          { type: "", x: 120.26600421944171, y: 30.295123976116074, z: 15.4 },
          { type: "key", x: 120.26598474223172, y: 30.29511147502895, z: 15.4 },
          { type: "", x: 120.26597116788176, y: 30.29509890590284, z: 15.4 },
          { type: "", x: 120.26598547626028, y: 30.295081841058693, z: 15.4 },
          { type: "", x: 120.26602316551805, y: 30.295071551185533, z: 15.4 },
          {
            type: "key",
            x: 120.26602910251187,
            y: 30.295006325370586,
            z: 15.4,
          },
          { type: "", x: 120.26608257291365, y: 30.294978831184494, z: 15.4 },
          {
            type: "key",
            x: 120.26611025414478,
            y: 30.294946745678732,
            z: 15.4,
          },
          { type: "", x: 120.26608362088439, y: 30.295000616403563, z: 15.4 },
          { type: "", x: 120.26608816936331, y: 30.295012155115316, z: 15.4 },
          { type: "", x: 120.26601236388451, y: 30.295097235271356, z: 15.4 },
          { type: "", x: 120.26603479558496, y: 30.295111720433717, z: 15.4 },
        ],
        [
          //一层
          {
            type: "",
            x: 120.266022269221,
            y: 30.295136134900925,
            z: 11.1000014434369276388644,
          },
          {
            type: "",
            x: 120.26607018319382,
            y: 30.295081327299428,
            z: 11.1000014522918277737906,
          },
          {
            type: "",
            x: 120.26604852023095,
            y: 30.2950676428003,
            z: 11.1000014360364629356555,
          },
          {
            type: "key",
            x: 120.26603768602007,
            y: 30.29507996370532,
            z: 11.1000014460724111348318,
          },
          {
            type: "key",
            x: 120.26601613675925,
            y: 30.295104473261198,
            z: 11.1000014571288889241222,
          },
          {
            type: "key",
            x: 120.26598897475026,
            y: 30.29513636102342,
            z: 11.1000014442401308659367,
          },
          {
            type: "",
            x: 120.26598795680533,
            y: 30.29513348955743,
            z: 11.1000014459594233138767,
          },
          {
            type: "",
            x: 120.26605761103963,
            y: 30.29505287955241,
            z: 11.1000014367309520687448,
          },
          {
            type: "",
            x: 120.26608223571623,
            y: 30.295060226780475,
            z: 11.1000014425814956846612,
          },
          {
            type: "key",
            x: 120.2661006650281,
            y: 30.29503986421598,
            z: 11.1000014512193919891196,
          },
          {
            type: "",
            x: 120.2661141063551,
            y: 30.295021339847548,
            z: 11.1000014535292593806284,
          },
          {
            type: "",
            x: 120.26608529266133,
            y: 30.29500674663175,
            z: 11.10007251651091028833,
          },
          {
            type: "",
            x: 120.26606572332417,
            y: 30.295029571558842,
            z: 11.10007287600405734316,
          },
          {
            type: "key",
            x: 120.26606747168297,
            y: 30.295030550344567,
            z: 11.1000014557691751467067,
          },
          {
            type: "",
            x: 120.26610605005412,
            y: 30.294994535519393,
            z: 11.1000014526037739964244,
          },
          {
            type: "key",
            x: 120.26612494829978,
            y: 30.29499111847445,
            z: 11.100001444040527395054,
          },
          {
            type: "",
            x: 120.26609058338829,
            y: 30.295006037727852,
            z: 11.1000013942951336988252,
          },
          {
            type: "",
            x: 120.26607630784315,
            y: 30.29499647009417,
            z: 11.1000014540518073845204,
          },
          {
            type: "",
            x: 120.26608717019937,
            y: 30.294982391846986,
            z: 11.1000014484705981329115,
          },
          {
            type: "key",
            x: 120.26607724727543,
            y: 30.294969471963288,
            z: 11.1000014411517284587335,
          },
          {
            type: "",
            x: 120.26605928251793,
            y: 30.294957503186172,
            z: 11.100001443733177466541,
          },
          {
            type: "",
            x: 120.2660859460819,
            y: 30.294927010111763,
            z: 11.1000011201258544629688,
          },
          {
            type: "",
            x: 120.26611342168403,
            y: 30.294944532667103,
            z: 11.100001451793947989792,
          },
          {
            type: "key",
            x: 120.26613009167355,
            y: 30.294924466956676,
            z: 11.100001446309707647593,
          },
          {
            type: "key",
            x: 120.26615225979764,
            y: 30.294899063186456,
            z: 11.100001446183049936821,
          },
          {
            type: "",
            x: 120.26615053616045,
            y: 30.29489760240984,
            z: 11.1000014447240182067516,
          },
          {
            type: "",
            x: 120.26611000397695,
            y: 30.294944603496614,
            z: 11.100001452891374523534,
          },
          {
            type: "",
            x: 120.2660876605073,
            y: 30.294931891787463,
            z: 11.10000027733403533945673,
          },
          {
            type: "",
            x: 120.26608135895242,
            y: 30.294938765246094,
            z: 11.100001456961544059396,
          },
          {
            type: "",
            x: 120.26607530978386,
            y: 30.294936546512613,
            z: 11.1000014563663728472883,
          },
          {
            type: "",
            x: 120.26605323985758,
            y: 30.294963183538275,
            z: 11.1000014373418196769156,
          },
          {
            type: "",
            x: 120.26608951791734,
            y: 30.294984944039047,
            z: 11.100001450022647532125,
          },
          {
            type: "",
            x: 120.26607604800786,
            y: 30.294997948929087,
            z: 11.1000014545020547032244,
          },
          {
            type: "",
            x: 120.26608522263618,
            y: 30.295004134934867,
            z: 11.1000008810355083394509,
          },
          {
            type: "",
            x: 120.26605181406458,
            y: 30.29504428916469,
            z: 11.1000014371428612831822,
          },
          {
            type: "",
            x: 120.26604995577739,
            y: 30.295072962882138,
            z: 11.100001437154182141392,
          },
          {
            type: "",
            x: 120.26609844093275,
            y: 30.295102791271326,
            z: 11.1000014577780946336362,
          },
          {
            type: "",
            x: 120.26604314743311,
            y: 30.2951685598295,
            z: 11.1000014441381413504486,
          },
          {
            type: "",
            x: 120.26612766738874,
            y: 30.295065021249542,
            z: 11.100001435850851906121,
          },
          {
            type: "",
            x: 120.2661764379549,
            y: 30.29498379993212,
            z: 11.100002852251571516899,
          },
          {
            type: "",
            x: 120.26621565603025,
            y: 30.29497139036094,
            z: 11.10000284594853335152,
          },
          {
            type: "",
            x: 120.26623819718812,
            y: 30.294975284723474,
            z: 11.1000028491815370939775,
          },
        ],

        [
          {
            type: "",
            x: 120.26624401187938,
            y: 30.294976014312144,
            z: 11.100000726253241282722,
          },
          {
            type: "key",
            x: 120.26630272368395,
            y: 30.294984410845746,
            z: 11.1000028139399571918875,
          },
          {
            type: "key",
            x: 120.26638485776135,
            y: 30.294998672965637,
            z: 11.100002883705341112866,
          },
          {
            type: "",
            x: 120.26638271856714,
            y: 30.29499479312582,
            z: 11.1000028789882130991057,
          },
          {
            type: "",
            x: 120.2662349465476,
            y: 30.294970109185204,
            z: 11.100001436771639213543,
          },
          {
            type: "",
            x: 120.26625533005296,
            y: 30.29489144032667,
            z: 11.1000014448640232880098,
          },
          {
            type: "key",
            x: 120.26629506606672,
            y: 30.2948969055656,
            z: 11.100001440370946221986,
          },
          {
            type: "key",
            x: 120.26634101460905,
            y: 30.294902564299232,
            z: 11.1000014516216843307264,
          },
          {
            type: "key",
            x: 120.26638291522356,
            y: 30.294908558809276,
            z: 11.100001445162622148413,
          },
          {
            type: "key",
            x: 120.26642581298205,
            y: 30.294913919391274,
            z: 11.1000014559971773066277,
          },
          {
            type: "",
            x: 120.26647946296352,
            y: 30.294919102586274,
            z: 11.1000014464497127415318,
          },
          {
            type: "key",
            x: 120.26662803386344,
            y: 30.294968153444398,
            z: 11.1000028056813890417633,
          },
          {
            type: "key",
            x: 120.26668058278597,
            y: 30.294985565154203,
            z: 11.100002847320728799935,
          },
          {
            type: "key",
            x: 120.26672708914933,
            y: 30.295000901230296,
            z: 11.1000028861209285526123,
          },
          {
            type: "",
            x: 120.26672739417022,
            y: 30.295052493448456,
            z: 11.1000014343798542892423,
          },
          {
            type: "",
            x: 120.2667326297424,
            y: 30.295059645007445,
            z: 11.1000014294995362695284,
          },
          {
            type: "",
            x: 120.26671205686331,
            y: 30.29509957860813,
            z: 11.100001454983372322556,
          },
          {
            type: "key",
            x: 120.26665397982279,
            y: 30.295079638982124,
            z: 11.1000028668658034500835,
          },
          {
            type: "",
            x: 120.26666088445742,
            y: 30.295077212387618,
            z: 11.1000028754313990656845,
          },
          {
            type: "",
            x: 120.2667135574029,
            y: 30.295096588988986,
            z: 11.100000726083326676191,
          },
          {
            type: "",
            x: 120.26673677786766,
            y: 30.295045776507692,
            z: 11.1000014377052307027122,
          },
          {
            type: "key",
            x: 120.26666986606729,
            y: 30.29502276393006,
            z: 11.1000014547457532964383,
          },
          {
            type: "",
            x: 120.26662233393985,
            y: 30.294980400337234,
            z: 11.100001444933754236947,
          },
          {
            type: "",
            x: 120.26647470079591,
            y: 30.294928046792265,
            z: 11.100002847563266575573,
          },
          {
            type: "",
            x: 120.2663647697485,
            y: 30.294912391917904,
            z: 11.1000029056665463991234,
          },
          {
            type: "",
            x: 120.26621825135278,
            y: 30.294878477872608,
            z: 11.100002916650944223863,
          },
          {
            type: "",
            x: 120.26643595942,
            y: 30.294383161437686,
            z: 11.100002900220219985142,
          },
          {
            type: "",
            x: 120.26652175016062,
            y: 30.294380358658533,
            z: 11.1000029047720296113746,
          },
          {
            type: "",
            x: 120.26715739969255,
            y: 30.294563838102825,
            z: 11.100005795274724305796,
          },
          {
            type: "",
            x: 120.26723975635218,
            y: 30.294267426513642,
            z: 11.100005789079229434332,
          },
          {
            type: "",
            x: 120.26719789581222,
            y: 30.294229192515644,
            z: 11.10000579635741196325,
          },
          {
            type: "",
            x: 120.26665652453826,
            y: 30.294058158516098,
            z: 11.10000551244890309962,
          },
          {
            type: "",
            x: 120.26666987962854,
            y: 30.294002127280873,
            z: 11.100005638708590732101,
          },
          {
            type: "",
            x: 120.26694794012205,
            y: 30.29408489667982,
            z: 11.1000014563400921978364,
          },
          {
            type: "",
            x: 120.26693165246031,
            y: 30.294116034050518,
            z: 11.1000014410394772669757,
          },
          {
            type: "",
            x: 120.26698591096611,
            y: 30.294148109487594,
            z: 11.1000028444435632580167,
          },
          {
            type: "key",
            x: 120.26707840436494,
            y: 30.29417389201056,
            z: 11.100002911034896751839,
          },
          {
            type: "",
            x: 120.26698436748961,
            y: 30.29414190377488,
            z: 11.1000028397491787088747,
          },
          {
            type: "",
            x: 120.26693533942996,
            y: 30.294113376858405,
            z: 11.100002839484542421034,
          },
          {
            type: "",
            x: 120.26694808184095,
            y: 30.29408378812266,
            z: 11.100002872739522043486,
          },
          {
            type: "",
            x: 120.26690745962028,
            y: 30.29405956955781,
            z: 11.100002907028599302366,
          },
          {
            type: "",
            x: 120.26675257537744,
            y: 30.29402127479989,
            z: 11.1000014412634264311056,
          },
          // ,{type:"",x: 120.26676498437418, y: 30.293842657741877, z: 11.1000014488922158516126}

          { type: "", x: 120.26675305507352, y: 30.293981638363483, z: 11 },
          { type: "", x: 120.26676052736121, y: 30.29390982994101, z: 10.2 },
          { type: "", x: 120.26676490785538, y: 30.293871846100508, z: 9.3 },
          // ,{type:"",x: 120.26676035760649, y: 30.293910173771813, z: 10}
          { type: "key", x: 120.2667528566748, y: 30.293821187698278, z: 9.3 },
          { type: "", x: 120.26675742569896, y: 30.29384505464657, z: 9.3 },
          { type: "", x: 120.26676513816976, y: 30.29385785103921, z: 9.3 },
          { type: "", x: 120.2667488874321, y: 30.294024800260438, z: 11 },
          {
            type: "",
            x: 120.2666689693479,
            y: 30.294000601422688,
            z: 11.100005638495962437556,
          },
          {
            type: "",
            x: 120.26668571749497,
            y: 30.293826030300433,
            z: 11.100005577709465040575,
          },
          {
            type: "",
            x: 120.26652590953324,
            y: 30.293817056737282,
            z: 11.1000014578493263067452,
          },
          {
            type: "key",
            x: 120.26652821545038,
            y: 30.293781875969973,
            z: 11.100001448523886033876,
          },
        ],
        // ,[
        //     {type:"",x: 120.26652179842681, y: 30.29381657194753, z: 11}
        //     ,{type:"",x: 120.26669671947187, y: 30.293828887744496,z: 11}
        //     ,{type:"",x: 120.26669306249717, y: 30.29387670075232, z: 18}
        //     ,{type:"_",x: 120.2667625279891, y: 30.29387216217762, z: 18}
        //     ,{type:"",x: 120.26676676583135, y: 30.293826347866133, z: 18}
        //     ,{type:"",x: 120.26671666690734, y: 30.29381020633981, z: 18}
        //     ,{type:"",x: 120.26657398766946, y: 30.29380391728507, z: 18}
        //     ,{type:"__",x: 120.26657547134509, y: 30.293749584242217, z: 18}
        //     ,{type:"",x: 120.26652867077527, y: 30.293747000088782, z: 18}
        // ]
      ];
      for (let i = 0; i < xyList.length; i++) {
        const e = xyList[i];
        for (let index = 0; index < e.length; index++) {
          const element = e[index];
          if (element.type == "key")
            viewer.entities.add({
              ray: "IntelligentRoaming_point",
              type: "IntelligentRoaming",
              if_id: i + "/" + index,
              position: Cesium.Cartesian3.fromDegrees(element.x, element.y, element.z + 1),
              clampToGround: true,
              point: {
                // color: Cesium.Color.RED,
                // pixelSize: 50,
                // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND//CLAMP_TO_GROUND,
                pixelSize: 10, //大小
                color: Cesium.Color.YELLOW,
                outlineColor: Cesium.Color.RED, //边框颜色
                outlineWidth: 3, //宽 边框
                //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,//CLAMP_TO_GROUND 高
                disableDepthTestDistance: Number.POSITIVE_INFINITY, //防止被遮挡
                translucencyByDistance: new Cesium.NearFarScalar(15, 1, 1000, 10),
                scaleByDistance: new Cesium.NearFarScalar(200, 0.7, 400, 0.3), //缩放
              },
              // label: {
              //     text: "       " + (index  + 1),
              // },
            });
          const line_1 = e[index];
          const line_2 = e[index + 1];
          if (line_2 == null) {
            break;
          }
          // viewer.entities.add({ type:"IntelligentRoaming",
          //     polyline: {
          //         positions: Cesium.Cartesian3.fromDegreesArrayHeights([line_1.x,line_1.y,line_1.z + 1,line_2.x,line_2.y,line_2.z + 1]),
          //         width: 15,
          //         material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.BLUE),
          //         clampToGround: false
          //     }
          // })
        }
      }

      var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);

      handler.setInputAction(function (movement) {
        var ray = viewer.scene.pick(movement.endPosition); //选取当前的entity
        if (!Cesium.defined(ray)) {
          return;
        }

        if (ray != null && ray.id != null && ray.id.ray == "IntelligentRoaming_point") {
          var model = ray.id;
          model.point.color = Cesium.Color.fromCssColorString("#3dc108").withAlpha(Number(50) / 100);
          // console.log(ray.id.ray)
          //包含该元素,鼠标变成手势
          $("canvas").css("cursor", "pointer"); //鼠标箭头换成小手
        } else {
          var mods = VMSDS.core.QueryModel_Entities_x(viewer, {
            ray: "IntelligentRoaming_point",
          });
          for (let index = 0; index < mods.length; index++) {
            const element = mods[index];
            element.point.color = Cesium.Color.YELLOW;
          }

          $("canvas").css("cursor", "default"); //鼠标小手换成箭头
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      handler.setInputAction(function (movement) {
        var ray = viewer.scene.pick(movement.position); //选取当前的entity
        if (!Cesium.defined(ray)) {
          return;
        }
        if (ray != null && ray.id != null && ray.id.ray == "IntelligentRoaming_point") {
          var model = ray.id;

          var wsc = {
            name: "PointSelectionRoaming_LEFT_DOUBLE_CLICK",
          };
          window.parent.postMessage(wsc, "*");
          if (!viewer.characterBehavior) {
            viewer.characterBehavior = characterBehavior();
          }
          timestamp.forEach(element => {
            element.lock = false;
          });
          var paragraph = 0;
          var axis = 0; //段落坐标及点坐标
          paragraph = Number(model.if_id.split("/")[0]);
          axis = Number(model.if_id.split("/")[1]);

          for (let index = 0; index < xyList_time.length; index++) {
            const element = xyList_time[index];
            if (element.index == paragraph && element.axis == axis - 1) {
              var start_time = element.time;
              // console.log(start_time,viewer.clock.startTime)
              viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date(start_time));
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      var xyList_time = [];
      var timestamp = []; //判断段落节点
      var _this = this;

      function characterBehavior() {
        var xyFineBezier = [];
        console.log(xyList);
        for (let i = 0; i < xyList.length; i++) {
          var mod = xyList[i][0];

          var q = Cesium.Cartesian3.fromDegrees(mod.x, mod.y, mod.z);
          q.time = timer;
          q.index = i;
          q.type = mod.type;
          xyFineBezier.push(q);

          const _element = xyList[i];
          for (let index = 0; index < _element.length; index++) {
            const element1 = xyList[i][index];
            const element2 = xyList[i][index + 1];
            const element3 = xyList[i][index + 2];

            if (element3 == null) {
              break;
            }
            var a = element1.x - element2.x;
            var b = element1.y - element2.y;
            var c = element2.x + a / 40;
            var d = element2.y + b / 40;

            var e = element2.x - element3.x;
            var f = element2.y - element3.y;
            var g = element2.x - e / 40;
            var h = element2.y - f / 40;

            var dc = new VMSDS.measure.DrawCurve(Cesium, VMSDS.GIS);
            var line = dc.fineBezier(Cesium.Cartesian3.fromDegreesArray([c, d, element2.x, element2.y, element2.x, element2.y, g, h]), 180); //180为弯道点的密度 适当调整可控制转弯速度

            line[0].time = FineBezierTimer;

            line[0].type = element2.type; //以中心的类型作为评判

            line[line.length - 1].time = timer;

            line[0].axis = index;

            line.forEach(element => {
              var point = {};
              var cartographic = Cesium.Cartographic.fromCartesian(element);
              point.x = Cesium.Math.toDegrees(cartographic.longitude);
              point.y = Cesium.Math.toDegrees(cartographic.latitude);
              point.z = element2.z;

              var Cartesian3 = Cesium.Cartesian3.fromDegrees(point.x, point.y, point.z);
              element.x = Cartesian3.x;
              element.y = Cartesian3.y;
              element.z = Cartesian3.z;

              element.index = i;
              xyFineBezier.push(element);
            });
          }

          var q = Cesium.Cartesian3.fromDegrees(xyList[i][xyList[i].length - 1].x, xyList[i][xyList[i].length - 1].y, xyList[i][0].z);
          q.index = i;
          q.type = xyList[i][xyList[i].length - 1].type;
          xyFineBezier.push(q);
        }
        var arr = [];
        xyList.forEach(e => {
          arr.push(e.x, e.y);
        });

        // 动态线
        // VMSDS.effect.DynamicLine(viewer,arr)
        function getTimeList(xyList) {
          var FlightRoamingData = []; //人物漫游时路线数据存储
          var cameraTimer = "04:00:00";
          var mm = timer; //一截路的时长
          for (let index = 0; index < xyList.length; index++) {
            if (Cesium.defined(xyList[index].time)) {
              mm = xyList[index].time;
            }

            const element = xyList[index];
            var tiemr = ISODateString(new Date());
            FlightRoamingData.push({
              id: "roaming_" + index,
              x: element.x,
              y: element.y,
              z: element.z,
              index: element.index,
              type: element.type,
              time: tiemr, //设置漫游起始时间或当前时间
              ss: 20, // 停留的时长
            });

            if (element.axis != null) {
              xyList_time.push({
                index: element.index,
                axis: element.axis,
                time: tiemr,
              });
            }
            var hour = cameraTimer.split(":")[0];
            var min = cameraTimer.split(":")[1];
            var sec = cameraTimer.split(":")[2];
            var s = Number(hour * 3600) + Number(min * 60) + Number(sec); //加当前相机时间
            function formatTime(s) {
              var t;
              if (s > -1) {
                var hour = Math.floor(s / 3600);
                var min = Math.floor(s / 60) % 60;
                var sec = s % 60;
                if (hour < 10) {
                  t = "0" + hour + ":";
                } else {
                  t = hour + ":";
                }

                if (min < 10) {
                  t += "0";
                }
                t += min + ":";
                if (sec < 10) {
                  t += "0";
                }
                t += sec.toFixed(2);
              }
              return t;
            }
            cameraTimer = formatTime(s + mm);
            function ISODateString(d) {
              function pad(n) {
                return n < 10 ? "0" + n : n;
              }
              return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + cameraTimer + "Z";
            }
          }
          return FlightRoamingData;
        }

        // var _xyList = Cesium.Cartesian3.fromDegreesArray(arr);
        var FlightRoamingData = getTimeList(xyFineBezier); //xyFineBezier

        // var point = {};
        // var cartographic = Cesium.Cartographic.fromCartesian(FlightRoamingData[100]);
        // point.x = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
        // point.y = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
        // point.z = cartographic.height.toFixed(1);

        // console.log(point,"getTimeList _ xyList")

        var arr = [];
        var polylineArr1 = [];
        var polylineArr2 = [];
        var polylineArr3 = [];

        var polylineArr4 = [];
        var index;

        var PatrolPoint = []; //巡视点

        FlightRoamingData.forEach(element => {
          var cartographic = Cesium.Cartographic.fromCartesian(element);
          var lng = Cesium.Math.toDegrees(cartographic.longitude);
          var lat = Cesium.Math.toDegrees(cartographic.latitude);
          var mapPosition = { x: lng, y: lat, z: cartographic.height };

          if (index != element.index) {
            index = element.index;
            timestamp.push(element);
          }

          if (element.index == 0) {
            arr.push({
              x: mapPosition.x,
              y: mapPosition.y,
              z: mapPosition.z,
              time: element.time,
            });
          } else if (element.index == 1) {
            arr.push({
              x: mapPosition.x,
              y: mapPosition.y,
              z: mapPosition.z,
              time: element.time,
            });
          } else if (element.index == 2) {
            arr.push({
              x: mapPosition.x,
              y: mapPosition.y,
              z: mapPosition.z,
              time: element.time,
            });
          }

          if (element.type == "key") {
            if (element.index == 0) {
              element.x = mapPosition.x;
              element.y = mapPosition.y;
              element.z = 15.4;
            } else if (element.index == 1) {
              element.x = mapPosition.x;
              element.y = mapPosition.y;
              element.z = 10.7;
            } else if (element.index == 2) {
              element.x = mapPosition.x;
              element.y = mapPosition.y;
              element.z = 10.9;
            }

            PatrolPoint.push(element);
          }
          if (mapPosition.z < 8) {
            console.log(mapPosition.z);
          }
          if (element.index == 0) {
            polylineArr1.push(mapPosition.x, mapPosition.y, mapPosition.z);
          } else if (element.index == 1) {
            polylineArr2.push(mapPosition.x, mapPosition.y, mapPosition.z);
          } else if (element.index == 2) {
            polylineArr3.push(mapPosition.x, mapPosition.y, mapPosition.z);
          } else if (element.index == 3) {
            if (element.type == "_") {
              upper1 = true;
            }
            if (element.type == "__") {
              upper2 = true;
            }
            if (upper1) {
              if (upper2) {
                polylineArr4.push(mapPosition.x, mapPosition.y, mapPosition.z);
              } else {
                polylineArr4.push(mapPosition.x, mapPosition.y, mapPosition.z);
              }
            } else {
              polylineArr4.push(mapPosition.x, mapPosition.y, mapPosition.z);
            }
          }
        });
        var upper1 = false;
        var upper2 = false;

        // _this.IntelligentRoamingDynamicLine(viewer, polylineArr1);
        // _this.IntelligentRoamingDynamicLine(viewer, polylineArr2);
        // _this.IntelligentRoamingDynamicLine(viewer, polylineArr3);
        var gltf_uri = "/assets/model/scene.gltf";
        if (!webgl_debug) var gltf_uri = "/3D/assets/model/scene.gltf";
        var entity = VMSDS.core.FlightRoaming(viewer, arr, gltf_uri, 0.01, "IntelligentRoamingV2", "IntelligentRoamingV2");
        entity.path = {
          show: true,
          leadTime: 1,
          width: 25,
          trailTime: 6,
          resolution: 1,
          material: new Cesium.PolylineGlowMaterialProperty({
            //发光线
            glowPower: 0.1,
            color: Cesium.Color.GREEN.withAlpha(1),
          }),
        };

        if (!entity) return;
        var _position = entity.position;
        var _point;
        app_viewer(function (point) {
          _point = point;
        });
        viewer.PatrolPoint = PatrolPoint;
        var worldSpeedCache = 1;
        viewer.PatrolIndex = 0;
        viewer.scene.postRender.addEventListener(
          (viewer.IntelligentRoaming_EventListener = function (scene, time) {
            if (!Cesium.defined(_position)) {
              return;
            }
            if (Cesium.defined(_point)) {
              _point.position = _position.getValue(time);
            }

            var Current_stamp = new Date(time.toString()).getTime();
            if (viewer.PatrolIndex >= PatrolPoint.length) {
              viewer.PatrolIndex--;
            }
            if (Current_stamp >= new Date(PatrolPoint[viewer.PatrolIndex].time.toString()).getTime() - 100) {
              //开始 && !InitialTime.lock

              _this.IntelligentRoaming_Speed({
                multiplier: 0, //当前世界速度 (可整体提高行走速度 必要也可以暂停模型)
              });

              var mapPosition = PatrolPoint[viewer.PatrolIndex];

              
              if(!viewer.IntelligentRoaming_wscTimeout){

                viewer.IntelligentRoaming_wscTimeout = setTimeout(() => {
                  var wsc = {
                    name: "IntelligentRoaming",
                    index: viewer.PatrolIndex,
                    position: mapPosition,
                    equipment: BackReference(viewer.PatrolIndex),
                  };
                  window.parent.postMessage(wsc, "*");
                  viewer.IntelligentRoaming_wscTimeout = false
                }, 2000);


              }
              

              if(viewer.IntelligentRoaming_Visual_TOGO_INDEX != 0 && viewer.IntelligentRoaming_Visual_TOGO_INDEX != undefined){
                
                var type = 1;
                //视角5定位点
                if (viewer.PatrolIndex > 13) {
                  type = 2;
                }
                if (viewer.PatrolIndex >= 23) {
                  type = 3;
                }
                if (viewer.PatrolIndex < 13) {
                  type = 1;
                }
                viewer.IntelligentRoaming_Visual_TOGO_INDEX = type;
                console.log(type, "typetypetypetype2");
                if (viewer.IntelligentRoaming_Visual_TOGO) {
                  _this.IntelligentRoaming_Visual({ visual: { type: 5 } }, undefined, type);
                }
              }
             
              viewer.PatrolIndex++;
              setTimeout(() => {
                _this.IntelligentRoaming_Speed({
                  multiplier: worldSpeedCache, //当前世界速度 (可整体提高行走速度 必要也可以暂停模型)
                });
              }, nodeTime);
            }

            if (viewer.clock.multiplier != 0) {
              worldSpeedCache = viewer.clock.multiplier;
            } //缓存变速

            if (Current_stamp > new Date(FlightRoamingData[0].time.toString()).getTime() && !FlightRoamingData[0].lock) {
              //开始
              console.log("时间重置判断成立", new Date(Current_stamp).format("yyyy-MM-dd hh:mm:ss"));
              FlightRoamingData[0].lock = true;
              viewer.PatrolIndex = 0; //重点坐标重置
            }
            if (Current_stamp > new Date(FlightRoamingData[FlightRoamingData.length - 1].time.toString()).getTime() - 100 && !FlightRoamingData[FlightRoamingData.length - 1].lock) {
              console.log("时间事件末尾", new Date(Current_stamp).format("yyyy-MM-dd hh:mm:ss"));
              FlightRoamingData[FlightRoamingData.length - 1].lock = true;
              Processing_layering(1);
              viewer.PatrolIndex = 0; //重点坐标重置
            }

            for (let index = 0; index < timestamp.length; index++) {
              const element = timestamp[index];
              if (Current_stamp > new Date(element.time).getTime() && !element.lock) {
                timestamp[index].lock = true; //锁
                console.log(index + 1 + "判断成立");
                Processing_layering(index + 1);
              }
            }
            // if(Current_stamp>new Date(timestamp[1].time).getTime() && !timestamp[1].lock ){
            //     timestamp[1].lock = true;//锁
            //      console.log("一楼判断成立")
            //     Processing_layering(1)
            // }
            // if(Current_stamp>new Date(timestamp[0].time).getTime() && !timestamp[0].lock ){
            //     timestamp[0].lock = true;//锁

            //     Processing_layering(2)
            //     console.log("二楼判断成立")
            // }
            // if(Current_stamp>new Date(timestamp[2].time).getTime()  && !timestamp[2].lock){
            //     timestamp[2].lock = true;//锁
            //     //  console.log("园外判断成立")
            //     Processing_layering(3)
            // }
          })
        );

        // entity.model.silhouetteColor = Cesium.Color.GREEN; //new Cesium.Color( 1.0 ,  0 ,  0 ,  1.0 );
        // entity.model.silhouetteSize = 1.0;
        // entity.id ='IntelligentRoamingV2';

        viewer.clock.multiplier = multiplier;

        function app_viewer(e) {
          var viewer = VMSDS.control.addOverview("Overview");
          $(".overview-div").append(`
                        <div class="btn-group mb-2" style="position: absolute;bottom: 10%;left: 42%;z-index: 999;">
                        </div>
                    `);

          viewer.scene.globe.show = false;
          var settings = {
            //http://127.0.0.1:9730/Dimensional/GetBuildingStructure
            url: "http://" + webgl_server_models_url + "/Dimensional/GetBuildingStructure",
            method: "GET",
            timeout: 0,
            async: false,
          };
          var tileset;
          $.ajax(settings).done(function (data) {
            data = data.datas[0].Routefile.file3Dtiles;
            for (let index = 0; index < data.length; index++) {
              const element = data[index];

              if (element.site != null && element.site != "") {
                if (element.site.indexOf("DX") != -1) {
                  tileset = VMSDS.core.add3DTiles(
                    viewer,
                    {
                      // name: "模型",
                      id: element.id,
                      url: element.site.replace("127.0.0.1:9731", webgl_server_uri), //gis.crcr.top:9732
                      flyTo: false,
                      duration: 0,
                      height: 10,
                    },
                    {
                      color: "color('white', 1)",
                      show: true,
                    }
                  );
                }
              }
            }
          });
          VMSDS.core.Location(viewer, {
            h: 4.39,
            p: -1.4693372159,
            r: 0,
            x: 120.26685,
            y: 30.294919,
            z: 288.03,
            duration: 0,
          });

          $(".overview-narrow").click();
          var point = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(0, 0),
            clampToGround: true,
            point: {
              pixelSize: 10, //大小
              color: Cesium.Color.YELLOW,
              outlineColor: Cesium.Color.RED, //边框颜色
              outlineWidth: 3, //宽 边框
              disableDepthTestDistance: Number.POSITIVE_INFINITY, //防止被遮挡
            },
          });

          e(point);
          _this.IntelligentRoamingDynamicLine(viewer, polylineArr1);
          _this.IntelligentRoamingDynamicLine(viewer, polylineArr2);
          _this.IntelligentRoamingDynamicLine(viewer, polylineArr3);
          return viewer;
        }

        return true;
      }
      var _this = this;
      function Processing_layering(type) {
        var modle;
        if (type === 3) {
          // _this.IntelligentRoaming_Visual({
          //     visual:{
          //       type : 3,
          //       zoomTo : false,
          //       height:13.4,
          //       direction : -35,
          //     }
          //   }//视角 0是无绑定 1是第一人称 3是第三人称 2是跟随
          // )

          VMSDS.GIS.building.forEach(e => {
            if (e.pId === "10" || e.pId === "9" || e.pId === "8" || e.pId === "7") {
              if (e.name == "2") {
                var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 0)",
                });
                em.style = defaultStyle;
              }
            }
          });

          return;
        }

        VMSDS.GIS.building.forEach(e => {
          switch (type) {
            case 2:
              if (e.name === "一层") {
                var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                modle = em;
              }
              break;
            case 1:
              if (e.name === "二层") {
                var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                modle = em;
              }
              break;
            default:
              return;
          }
        });

        var id;
        var pid;
        pid = modle.element.pId;
        id = modle.element.id;
        if (type === 2) {
          var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
            layer: "layer_2",
          });
          mods.push(VMSDS.core.QueryModel_Entities(VMSDS.GIS, "polylineArr1"));

          mods.forEach(element => {
            if (element != null) {
              element.show = false;
            }
          });
          var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
            layer: "layer_1",
          });
          mods.push(VMSDS.core.QueryModel_Entities(VMSDS.GIS, "polylineArr2"));

          mods.forEach(element => {
            if (element != null) {
              element.show = true;
            }
          });
          // 93
          VMSDS.GIS.building.forEach(e => {
            var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
            if (em != null) {
              if (e.name === "一层") {
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 1)",
                });
                em.style = defaultStyle;
              }

              if (e.pId === "93") {
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 1)",
                });
                em.style = defaultStyle;
              }
              if (e.pId === "94" || e.name === "二层" || e.name === "屋顶") {
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 0)",
                });

                em.style = defaultStyle;
              }
            }
          });
        }
        if (type === 1) {
          var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
            layer: "layer_1",
          });
          mods.push(VMSDS.core.QueryModel_Entities(VMSDS.GIS, "polylineArr2"));
          mods.forEach(element => {
            if (element != null) {
              element.show = false;
            }
          });
          var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
            layer: "layer_2",
          });
          mods.push(VMSDS.core.QueryModel_Entities(VMSDS.GIS, "polylineArr1"));
          mods.forEach(element => {
            if (element != null) {
              element.show = true;
            }
          });
          // 94
          VMSDS.GIS.building.forEach(e => {
            var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
            if (em != null) {
              if (e.name === "二层") {
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 1)",
                });
                em.style = defaultStyle;
              }

              if (e.pId === "94") {
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 1)",
                });
                em.style = defaultStyle;
              }
              if (e.pId === "93" || e.name === "一层" || e.name === "屋顶") {
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 0)",
                });
                em.style = defaultStyle;
              }
            }
          });
        }
      }
      var _this = this;
      function BackReference(index) {
        var list = [
          [
            { name: "1#LCU柜", id: "1435148518881800194" },
            { name: "2#LCU柜", id: "1435149385760550913" },
            { name: "3#LCU柜", id: "1435149753278050305" },
            { name: "4#LCU柜", id: "1435150089208246274" },
          ],
          [{ name: "公用LCU柜1", id: "1436253107630669825" }],
          [{ name: "中控室(监控)", id: "" }], //{name: '中控室(监控)',id:""}
          [
            { name: "5#LCU柜", id: "1435150511021010946" },
            { name: "6#LCU柜", id: "1435150764646379522" },
            { name: "7#LCU柜", id: "1435151005139382273" },
            { name: "公用LCU柜2", id: "1436255869214949378" },
          ],
          [
            { name: "1AH1#进线隔离柜", id: "1435146244776308737" },
            { name: "2#10kv进线开关柜", id: "1435144190594953218" },
            { name: "2#10kv计量柜", id: "1435145126826520578" },
            { name: "4AH母线压变柜", id: "1435163084671987713" },
          ],
          [
            { name: "1#电动机柜", id: "1436241650620846082" },
            { name: "2#电动机柜", id: "1436242019547631618" },
            { name: "3#电动机柜", id: "1436242275794440194" },
            { name: "4#电动机柜", id: "1436242783905009665" },
          ],
          [
            { name: "2#站用变柜", id: "1428156867151982593" },
            { name: "母联开关柜", id: "1436243802906972162" },
            { name: "2#进线计量柜", id: "1436244069891198978" },
          ],
          [
            { name: "5#软启柜", id: "1435136131504058370" },
            { name: "6#软启柜", id: "1435136473293697026" },
            { name: "7#软启柜", id: "1435136767373127681" },
          ],
          [
            { name: "1#电容柜", id: "1435137682490568705" },
            { name: "2#电容柜", id: "1435138026926813185" },
            { name: "3#电容柜", id: "1435138273610608641" },
            { name: "4#电容柜", id: "1435138550698913793" },
          ],
          [
            { name: "出线柜", id: "1436248542432755714" },
            { name: "电容柜", id: "1436248844342951938" },
            { name: "125kvA进线柜", id: "1436249160023048194" },
          ],
          [
            { name: "5#无功补偿柜", id: "1435134970092892162" },
            { name: "6#无功补偿柜", id: "1435135259059466241" },
            { name: "7#无功补偿柜", id: "1435135520914059265" },
          ],
          [
            { name: "1#10kv进线隔离柜", id: "1435146244776308737" },
            { name: "1#10kv进线开关柜", id: "1435146512834277377" },
            { name: "1#10kv计量柜", id: "1435146812970283010" },
            { name: "1#10kv母线压变柜", id: "1435160241781125121" },
          ],
          [
            { name: "母联隔离柜", id: "1436240666452578306" },
            { name: "1#所用变柜", id: "1435062679606702081" },
            { name: "5#10kv电动机柜", id: "1436244966817955842" },
            { name: "6#10kv电动机柜", id: "1436246417724178434" },
            { name: "7#10kv电动机柜", id: "1436246731315511297" },
          ],
          [
            { name: "1#清污机", id: "1435125432065241089" },
            { name: "2#清污机", id: "1435125716640378882" },
          ],
          [
            { name: "3#清污机", id: "1435126152793468930" },
            { name: "4#清污机", id: "1435126508797603842" },
          ],
          [{ name: "1#水泵", id: "619534551667965952" }],
          [{ name: "2#水泵", id: "1435054816809234433" }],
          [{ name: "3#水泵", id: "1435055173153107970" }],
          [{ name: "4#水泵", id: "1435055590285029377" }],
          [{ name: "5#水泵", id: "1435056521521180673" }],
          [{ name: "6#水泵", id: "1435057652284567554" }],
          [{ name: "7#水泵", id: "1435058088999694337" }],
          [{ name: "2#皮带机", id: "1436238295605465089" }],
          [{ name: "1#皮带机", id: "1436237362930700290" }],
          [{ name: "", id: "" }],
          [
            { name: "2#启闭机", id: "1435130443943948289" },
            { name: "3#启闭机", id: "1435130143325597698" },
          ],
          [{ name: "外江1 (监控)", id: "" }],
          [{ name: "1#启闭机", id: "1435129452477591553" }],
          [{ name: "外江2 (监控)", id: "" }],
        ];
        if (_this.PumpBodyBuilding != null) {
          if (index === 19 || index === 15) {
            for (var i = 0; i < viewer.scene.primitives.length; i++) {
              var tileset = viewer.scene.primitives.get(i);
              var str = decodeURI(tileset._url);
              if (str.indexOf("水泵建筑体") != -1) {
                _this.PumpBodyBuilding(1, tileset);
                if (index == 19) {
                  setTimeout(() => {
                    _this.PumpBodyBuilding(2, tileset);
                  }, 3000);
                }
              }
            }
          }
          if (index === 22) {
            for (var i = 0; i < viewer.scene.primitives.length; i++) {
              var tileset = viewer.scene.primitives.get(i);
              var str = decodeURI(tileset._url);
              if (str.indexOf("5号楼/建筑/1/") != -1) {
                _this.PumpBodyBuilding(3, tileset);
              }
            }
          }
        }

        return list[index];

        // window.data_popup_list
      }
    }
    //定位时戳到中午十二点
    SetWorldTime() {
      const viewer = VMSDS.GIS;
      var start_time = "2021-10-08T12:00:00Z";
      viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date(start_time));
    }
    //全局飞行漫游
    FlyingPanoramicRoaming() {
      var viewer = VMSDS.GIS;

      viewer.clock.multiplier = 2.0;
      var options = {
        positions: [
          [120.26730353012213, 30.2926160728561, 150],
          [120.26638670526987, 30.2943756711068, 140],
          [120.26625665918722, 30.2949843623903, 150],
          [120.26594593484835, 30.2953727187101, 150],
          [120.26545892070557, 30.2960308015834, 150],
          [120.26520953032043, 30.2967639880006, 150],
          [120.26547230392946, 30.2969449961168, 150],
          [120.26569720003506, 30.2970040303573, 150],
          [120.26612498525446, 30.2965420774305, 150],
          [120.26649372832262, 30.2957100846684, 150],
          [120.26694875249261, 30.2947171604514, 150],
          [120.2674325547602, 30.29367795220445, 150],
          [120.26766243173768, 30.2928972891561, 150],
          [120.26770465396037, 30.2925433109253, 150],
          [120.2674504061049, 30.292542225761, 150],
          [120.26732739978507, 30.2925843223619, 150],
        ],
      };
      options.url = "./assets/model/drone2/scene.gltf";
      options.scale = 0.01;
      var entity = VMSDS.core.Flight_roaming_curve_filling(viewer, options);
      //绑定方式
      this.IntelligentRoaming_Visual(
        {
          visual: {
            type: 3,
            height: 10.4,
            direction: -35,
          },
        }, //视角 0是无绑定 1是第一人称 3是第三人称 2是跟随
        entity
      );
      var _this = this;
      var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function (movement) {
        console.log("脱离");
        _this.IntelligentRoaming_Visual(
          {
            visual: {
              type: 2,
              height: 10.4,
              direction: -35,
            },
          }, //视角 0是无绑定 1是第一人称 3是第三人称 2是跟随
          entity
        );
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      // this.example_runshineAnalysis()
    }

    /**
     * 漫游展示 不带贴地
     */
    IntelligentRoaming(value) {
      var setvisible = VMSDS.effect.runshineAnalysis();
      setvisible(VMSDS.GIS, "play"); //stop
      var _this = this;
      if (value.debug) {
        var viewModel = {
          rate: 1.0,
          perspective: 3,
        };

        Cesium.knockout.track(viewModel);
        var toolbar = document.getElementById("toolbar");
        Cesium.knockout.applyBindings(viewModel, toolbar);
        for (var name in viewModel) {
          if (viewModel.hasOwnProperty(name)) {
            Cesium.knockout.getObservable(viewModel, name).subscribe(updateMaterial);
          }
        }
        function updateMaterial() {
          // console.log(viewModel)
          _this.IntelligentRoaming_Speed({ multiplier: Number(viewModel.rate) });

          _this.IntelligentRoaming_Visual({
            visual: {
              type: Number(viewModel.perspective),
              height: 10.4,
              direction: -35,
            },
          });
        }
      }
      const viewer = VMSDS.GIS;
      var timer = value.timer == null ? 10 : value.timer; //模型行走数度

      var FineBezierTimer = value.FineBezierTimer == null ? 0.01 : value.FineBezierTimer; //算法路径速度

      var multiplier = value.multiplier == null ? 1 : value.multiplier; //当前世界速度 (可整体提高行走速度 必要也可以暂停模型)

      var nodeTime = value.nodeTime == null ? 0 : value.nodeTime * 1000; //节点停留时间

      viewer.RoamingStatus == true; //漫游防冲突

      window.mousePosition = function (ev) {
        //漫游防冲突
        return {
          // IE浏览器
          x: 0,
          y: 0,
        };
      };

      var xyList = [
        //二层
        [
          { type: "", x: 120.2660368451607, y: 30.29511702210979, z: 15.4 },
          { type: "key", x: 120.2660012287198, y: 30.29509367822525, z: 15.4 },
          { type: "", x: 120.26601760723695, y: 30.295109004174265, z: 15.4 },
          { type: "", x: 120.26600421944171, y: 30.295123976116074, z: 15.4 },
          { type: "key", x: 120.26598474223172, y: 30.29511147502895, z: 15.4 },
          { type: "", x: 120.26597116788176, y: 30.29509890590284, z: 15.4 },
          { type: "", x: 120.26598547626028, y: 30.295081841058693, z: 15.4 },
          { type: "", x: 120.26602316551805, y: 30.295071551185533, z: 15.4 },
          {
            type: "key",
            x: 120.26602910251187,
            y: 30.295006325370586,
            z: 15.4,
          },
          { type: "", x: 120.26608257291365, y: 30.294978831184494, z: 15.4 },
          {
            type: "key",
            x: 120.26611025414478,
            y: 30.294946745678732,
            z: 15.4,
          },
          { type: "", x: 120.26608362088439, y: 30.295000616403563, z: 15.4 },
          { type: "", x: 120.26608816936331, y: 30.295012155115316, z: 15.4 },
          { type: "", x: 120.26601236388451, y: 30.295097235271356, z: 15.4 },
          { type: "", x: 120.26603479558496, y: 30.295111720433717, z: 15.4 },
        ],
        [
          {
            type: "",
            x: 120.266022269221,
            y: 30.295136134900925,
            z: 11.1000014434369276388644,
          },
          {
            type: "",
            x: 120.26607018319382,
            y: 30.295081327299428,
            z: 11.1000014522918277737906,
          },
          {
            type: "",
            x: 120.26604852023095,
            y: 30.2950676428003,
            z: 11.1000014360364629356555,
          },
          {
            type: "key",
            x: 120.26603768602007,
            y: 30.29507996370532,
            z: 11.1000014460724111348318,
          },
          {
            type: "key",
            x: 120.26601613675925,
            y: 30.295104473261198,
            z: 11.1000014571288889241222,
          },
          {
            type: "key",
            x: 120.26598897475026,
            y: 30.29513636102342,
            z: 11.1000014442401308659367,
          },
          {
            type: "",
            x: 120.26598795680533,
            y: 30.29513348955743,
            z: 11.1000014459594233138767,
          },
          {
            type: "",
            x: 120.26605761103963,
            y: 30.29505287955241,
            z: 11.1000014367309520687448,
          },
          {
            type: "",
            x: 120.26608223571623,
            y: 30.295060226780475,
            z: 11.1000014425814956846612,
          },
          {
            type: "key",
            x: 120.2661006650281,
            y: 30.29503986421598,
            z: 11.1000014512193919891196,
          },
          {
            type: "",
            x: 120.2661141063551,
            y: 30.295021339847548,
            z: 11.1000014535292593806284,
          },
          {
            type: "",
            x: 120.26608529266133,
            y: 30.29500674663175,
            z: 11.10007251651091028833,
          },
          {
            type: "",
            x: 120.26606572332417,
            y: 30.295029571558842,
            z: 11.10007287600405734316,
          },
          {
            type: "key",
            x: 120.26606747168297,
            y: 30.295030550344567,
            z: 11.1000014557691751467067,
          },
          {
            type: "",
            x: 120.26610605005412,
            y: 30.294994535519393,
            z: 11.1000014526037739964244,
          },
          {
            type: "key",
            x: 120.26612494829978,
            y: 30.29499111847445,
            z: 11.100001444040527395054,
          },
          {
            type: "",
            x: 120.26609058338829,
            y: 30.295006037727852,
            z: 11.1000013942951336988252,
          },
          {
            type: "",
            x: 120.26607630784315,
            y: 30.29499647009417,
            z: 11.1000014540518073845204,
          },
          {
            type: "",
            x: 120.26608717019937,
            y: 30.294982391846986,
            z: 11.1000014484705981329115,
          },
          {
            type: "key",
            x: 120.26607724727543,
            y: 30.294969471963288,
            z: 11.1000014411517284587335,
          },
          {
            type: "",
            x: 120.26605928251793,
            y: 30.294957503186172,
            z: 11.100001443733177466541,
          },
          {
            type: "",
            x: 120.2660859460819,
            y: 30.294927010111763,
            z: 11.1000011201258544629688,
          },
          {
            type: "",
            x: 120.26611342168403,
            y: 30.294944532667103,
            z: 11.100001451793947989792,
          },
          {
            type: "key",
            x: 120.26613009167355,
            y: 30.294924466956676,
            z: 11.100001446309707647593,
          },
          {
            type: "key",
            x: 120.26615225979764,
            y: 30.294899063186456,
            z: 11.100001446183049936821,
          },
          {
            type: "",
            x: 120.26615053616045,
            y: 30.29489760240984,
            z: 11.1000014447240182067516,
          },
          {
            type: "",
            x: 120.26611000397695,
            y: 30.294944603496614,
            z: 11.100001452891374523534,
          },
          {
            type: "",
            x: 120.2660876605073,
            y: 30.294931891787463,
            z: 11.10000027733403533945673,
          },
          {
            type: "",
            x: 120.26608135895242,
            y: 30.294938765246094,
            z: 11.100001456961544059396,
          },
          {
            type: "",
            x: 120.26607530978386,
            y: 30.294936546512613,
            z: 11.1000014563663728472883,
          },
          {
            type: "",
            x: 120.26605323985758,
            y: 30.294963183538275,
            z: 11.1000014373418196769156,
          },
          {
            type: "",
            x: 120.26608951791734,
            y: 30.294984944039047,
            z: 11.100001450022647532125,
          },
          {
            type: "",
            x: 120.26607604800786,
            y: 30.294997948929087,
            z: 11.1000014545020547032244,
          },
          {
            type: "",
            x: 120.26608522263618,
            y: 30.295004134934867,
            z: 11.1000008810355083394509,
          },
          {
            type: "",
            x: 120.26605181406458,
            y: 30.29504428916469,
            z: 11.1000014371428612831822,
          },
          {
            type: "",
            x: 120.26604995577739,
            y: 30.295072962882138,
            z: 11.100001437154182141392,
          },
          {
            type: "",
            x: 120.26609844093275,
            y: 30.295102791271326,
            z: 11.1000014577780946336362,
          },
          {
            type: "",
            x: 120.26604314743311,
            y: 30.2951685598295,
            z: 11.1000014441381413504486,
          },
          {
            type: "",
            x: 120.26612766738874,
            y: 30.295065021249542,
            z: 11.100001435850851906121,
          },
          {
            type: "",
            x: 120.2661764379549,
            y: 30.29498379993212,
            z: 11.100002852251571516899,
          },
          {
            type: "",
            x: 120.26621565603025,
            y: 30.29497139036094,
            z: 11.10000284594853335152,
          },
          {
            type: "",
            x: 120.26623819718812,
            y: 30.294975284723474,
            z: 11.1000028491815370939775,
          },
        ],
        //一层
        [
          {
            type: "",
            x: 120.26624401187938,
            y: 30.294976014312144,
            z: 11.100000726253241282722,
          },
          {
            type: "key",
            x: 120.26630272368395,
            y: 30.294984410845746,
            z: 11.1000028139399571918875,
          },
          {
            type: "key",
            x: 120.26638485776135,
            y: 30.294998672965637,
            z: 11.100002883705341112866,
          },
          {
            type: "",
            x: 120.26638271856714,
            y: 30.29499479312582,
            z: 11.1000028789882130991057,
          },
          {
            type: "",
            x: 120.2662349465476,
            y: 30.294970109185204,
            z: 11.100001436771639213543,
          },
          {
            type: "",
            x: 120.26625533005296,
            y: 30.29489144032667,
            z: 11.1000014448640232880098,
          },
          {
            type: "key",
            x: 120.26629506606672,
            y: 30.2948969055656,
            z: 11.100001440370946221986,
          },
          {
            type: "key",
            x: 120.26634101460905,
            y: 30.294902564299232,
            z: 11.1000014516216843307264,
          },
          {
            type: "key",
            x: 120.26638291522356,
            y: 30.294908558809276,
            z: 11.100001445162622148413,
          },
          {
            type: "key",
            x: 120.26642581298205,
            y: 30.294913919391274,
            z: 11.1000014559971773066277,
          },
          {
            type: "",
            x: 120.26647946296352,
            y: 30.294919102586274,
            z: 11.1000014464497127415318,
          },
          {
            type: "key",
            x: 120.26662803386344,
            y: 30.294968153444398,
            z: 11.1000028056813890417633,
          },
          {
            type: "key",
            x: 120.26668058278597,
            y: 30.294985565154203,
            z: 11.100002847320728799935,
          },
          {
            type: "key",
            x: 120.26672708914933,
            y: 30.295000901230296,
            z: 11.1000028861209285526123,
          },
          {
            type: "",
            x: 120.26672739417022,
            y: 30.295052493448456,
            z: 11.1000014343798542892423,
          },
          {
            type: "",
            x: 120.2667326297424,
            y: 30.295059645007445,
            z: 11.1000014294995362695284,
          },
          {
            type: "",
            x: 120.26671205686331,
            y: 30.29509957860813,
            z: 11.100001454983372322556,
          },
          {
            type: "key",
            x: 120.26665397982279,
            y: 30.295079638982124,
            z: 11.1000028668658034500835,
          },
          {
            type: "",
            x: 120.26666088445742,
            y: 30.295077212387618,
            z: 11.1000028754313990656845,
          },
          {
            type: "",
            x: 120.2667135574029,
            y: 30.295096588988986,
            z: 11.100000726083326676191,
          },
          {
            type: "",
            x: 120.26673677786766,
            y: 30.295045776507692,
            z: 11.1000014377052307027122,
          },
          {
            type: "key",
            x: 120.26666986606729,
            y: 30.29502276393006,
            z: 11.1000014547457532964383,
          },
          {
            type: "",
            x: 120.26662233393985,
            y: 30.294980400337234,
            z: 11.100001444933754236947,
          },
          {
            type: "",
            x: 120.26647470079591,
            y: 30.294928046792265,
            z: 11.100002847563266575573,
          },
          {
            type: "",
            x: 120.2663647697485,
            y: 30.294912391917904,
            z: 11.1000029056665463991234,
          },
          {
            type: "",
            x: 120.26621825135278,
            y: 30.294878477872608,
            z: 11.100002916650944223863,
          },
          {
            type: "",
            x: 120.26643595942,
            y: 30.294383161437686,
            z: 11.100002900220219985142,
          },
          {
            type: "",
            x: 120.26652175016062,
            y: 30.294380358658533,
            z: 11.1000029047720296113746,
          },
          {
            type: "",
            x: 120.26715739969255,
            y: 30.294563838102825,
            z: 11.100005795274724305796,
          },
          {
            type: "",
            x: 120.26723975635218,
            y: 30.294267426513642,
            z: 11.100005789079229434332,
          },
          {
            type: "",
            x: 120.26719789581222,
            y: 30.294229192515644,
            z: 11.10000579635741196325,
          },
          {
            type: "",
            x: 120.26665652453826,
            y: 30.294058158516098,
            z: 11.10000551244890309962,
          },
          {
            type: "",
            x: 120.26666987962854,
            y: 30.294002127280873,
            z: 11.100005638708590732101,
          },
          {
            type: "",
            x: 120.26694794012205,
            y: 30.29408489667982,
            z: 11.1000014563400921978364,
          },
          {
            type: "",
            x: 120.26693165246031,
            y: 30.294116034050518,
            z: 11.1000014410394772669757,
          },
          {
            type: "",
            x: 120.26698591096611,
            y: 30.294148109487594,
            z: 11.1000028444435632580167,
          },
          {
            type: "key",
            x: 120.26707840436494,
            y: 30.29417389201056,
            z: 11.100002911034896751839,
          },
          {
            type: "",
            x: 120.26698436748961,
            y: 30.29414190377488,
            z: 11.1000028397491787088747,
          },
          {
            type: "",
            x: 120.26693533942996,
            y: 30.294113376858405,
            z: 11.100002839484542421034,
          },
          {
            type: "",
            x: 120.26694808184095,
            y: 30.29408378812266,
            z: 11.100002872739522043486,
          },
          {
            type: "",
            x: 120.26690745962028,
            y: 30.29405956955781,
            z: 11.100002907028599302366,
          },
          {
            type: "",
            x: 120.26675257537744,
            y: 30.29402127479989,
            z: 11.1000014412634264311056,
          },
          // ,{type:"",x: 120.26676498437418, y: 30.293842657741877, z: 11.1000014488922158516126}

          { type: "", x: 120.26675305507352, y: 30.293981638363483, z: 11 },
          { type: "", x: 120.26676052736121, y: 30.29390982994101, z: 10.2 },
          { type: "", x: 120.26676490785538, y: 30.293871846100508, z: 9.3 },
          // ,{type:"",x: 120.26676035760649, y: 30.293910173771813, z: 10}
          { type: "key", x: 120.2667528566748, y: 30.293821187698278, z: 9.3 },
          { type: "", x: 120.26675742569896, y: 30.29384505464657, z: 9.3 },
          { type: "", x: 120.26676513816976, y: 30.29385785103921, z: 9.3 },
          { type: "", x: 120.2667488874321, y: 30.294024800260438, z: 11 },
          {
            type: "",
            x: 120.2666689693479,
            y: 30.294000601422688,
            z: 11.100005638495962437556,
          },
          {
            type: "",
            x: 120.26668571749497,
            y: 30.293826030300433,
            z: 11.100005577709465040575,
          },
          {
            type: "",
            x: 120.26652590953324,
            y: 30.293817056737282,
            z: 11.1000014578493263067452,
          },
          {
            type: "key",
            x: 120.26652821545038,
            y: 30.293781875969973,
            z: 11.100001448523886033876,
          },
        ],
        // ,
        // [
        //     {type:"",x: 120.26652179842681, y: 30.29381657194753, z: 11}
        //     ,{type:"",x: 120.26669671947187, y: 30.293828887744496,z: 11}
        //     ,{type:"",x: 120.26669306249717, y: 30.29387670075232, z: 18}
        //     ,{type:"_",x: 120.2667625279891, y: 30.29387216217762, z: 18}
        //     ,{type:"",x: 120.26676676583135, y: 30.293826347866133, z: 18}
        //     ,{type:"",x: 120.26671666690734, y: 30.29381020633981, z: 18}
        //     ,{type:"",x: 120.26657398766946, y: 30.29380391728507, z: 18}
        //     ,{type:"__",x: 120.26657547134509, y: 30.293749584242217, z: 18}
        //     ,{type:"",x: 120.26652867077527, y: 30.293747000088782, z: 18}
        // ]
      ];
      // xyList.forEach(e => {
      //     for (let index = 0; index < e.length; index++) {
      //         const element = e[index];
      //         viewer.entities.add({
      //             type:"IntelligentRoaming",
      //             position: Cesium.Cartesian3.fromDegrees(element.x, element.y,element.z),
      //             clampToGround: true,
      //             point: {
      //                 // color: Cesium.Color.RED,
      //                 // pixelSize: 50,
      //                 // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND//CLAMP_TO_GROUND,
      //                 pixelSize: 10,//大小
      //                 color: Cesium.Color.YELLOW,
      //                 outlineColor: Cesium.Color.RED,//边框颜色
      //                 outlineWidth: 3,//宽 边框
      //                 //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,//CLAMP_TO_GROUND 高
      //                 disableDepthTestDistance: Number.POSITIVE_INFINITY//防止被遮挡
      //             },
      //             label: {
      //                 text: "       " + (index  + 1),
      //             },
      //         });

      //     }
      // });

      var xyFineBezier = [];

      for (let i = 0; i < xyList.length; i++) {
        var mod = xyList[i][0];
        var q = Cesium.Cartesian3.fromDegrees(mod.x, mod.y, mod.z);
        q.time = timer;
        q.index = i;
        q.type = mod.type;
        xyFineBezier.push(q);

        const _element = xyList[i];
        for (let index = 0; index < _element.length; index++) {
          const element1 = xyList[i][index];
          const element2 = xyList[i][index + 1];
          const element3 = xyList[i][index + 2];

          if (element3 == null) {
            break;
          }
          var a = element1.x - element2.x;
          var b = element1.y - element2.y;
          var c = element2.x + a / 40;
          var d = element2.y + b / 40;

          var e = element2.x - element3.x;
          var f = element2.y - element3.y;
          var g = element2.x - e / 40;
          var h = element2.y - f / 40;

          var dc = new VMSDS.measure.DrawCurve(Cesium, VMSDS.GIS);
          var line = dc.fineBezier(Cesium.Cartesian3.fromDegreesArray([c, d, element2.x, element2.y, element2.x, element2.y, g, h]), 180); //180为弯道点的密度 适当调整可控制转弯速度

          line[0].time = FineBezierTimer;

          line[0].type = element2.type; //以中心的类型作为评判

          line[line.length - 1].time = timer;
          line.forEach(element => {
            var point = {};
            var cartographic = Cesium.Cartographic.fromCartesian(element);
            point.x = Cesium.Math.toDegrees(cartographic.longitude);
            point.y = Cesium.Math.toDegrees(cartographic.latitude);
            point.z = element2.z;

            var Cartesian3 = Cesium.Cartesian3.fromDegrees(point.x, point.y, point.z);
            element.x = Cartesian3.x;
            element.y = Cartesian3.y;
            element.z = Cartesian3.z;

            element.index = i;
            xyFineBezier.push(element);
          });
        }

        var q = Cesium.Cartesian3.fromDegrees(xyList[i][xyList[i].length - 1].x, xyList[i][xyList[i].length - 1].y, xyList[i][0].z);
        q.index = i;
        q.type = xyList[i][xyList[i].length - 1].type;
        xyFineBezier.push(q);
      }
      var arr = [];
      xyList.forEach(e => {
        arr.push(e.x, e.y);
      });

      // 动态线
      // VMSDS.effect.DynamicLine(viewer,arr)

      function getTimeList(xyList) {
        var FlightRoamingData = []; //人物漫游时路线数据存储
        var cameraTimer = "04:00:00";
        var mm = timer; //一截路的时长
        for (let index = 0; index < xyList.length; index++) {
          if (Cesium.defined(xyList[index].time)) {
            mm = xyList[index].time;
          }

          const element = xyList[index];

          FlightRoamingData.push({
            id: "roaming_" + index,
            x: element.x,
            y: element.y,
            z: element.z,
            index: element.index,
            type: element.type,
            time: ISODateString(new Date()), //设置漫游起始时间或当前时间
            ss: 20, // 停留的时长
          });
          var hour = cameraTimer.split(":")[0];
          var min = cameraTimer.split(":")[1];
          var sec = cameraTimer.split(":")[2];
          var s = Number(hour * 3600) + Number(min * 60) + Number(sec); //加当前相机时间
          function formatTime(s) {
            var t;
            if (s > -1) {
              var hour = Math.floor(s / 3600);
              var min = Math.floor(s / 60) % 60;
              var sec = s % 60;
              if (hour < 10) {
                t = "0" + hour + ":";
              } else {
                t = hour + ":";
              }

              if (min < 10) {
                t += "0";
              }
              t += min + ":";
              if (sec < 10) {
                t += "0";
              }
              t += sec.toFixed(2);
            }
            return t;
          }
          cameraTimer = formatTime(s + mm);
          function ISODateString(d) {
            function pad(n) {
              return n < 10 ? "0" + n : n;
            }
            return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + cameraTimer + "Z";
          }
        }
        return FlightRoamingData;
      }

      xyList = Cesium.Cartesian3.fromDegreesArray(arr);
      var FlightRoamingData = getTimeList(xyFineBezier); //xyFineBezier

      var arr = [];
      var polylineArr1 = [];
      var polylineArr2 = [];
      var polylineArr3 = [];

      var polylineArr4 = [];
      var timestamp = []; //判断段落节点
      var index;

      var PatrolPoint = []; //巡视点

      FlightRoamingData.forEach(element => {
        var cartographic = Cesium.Cartographic.fromCartesian(element);
        var lng = Cesium.Math.toDegrees(cartographic.longitude);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var mapPosition = { x: lng, y: lat, z: cartographic.height };

        if (index != element.index) {
          index = element.index;
          timestamp.push(element);
        }

        if (element.index == 0) {
          arr.push({
            x: mapPosition.x,
            y: mapPosition.y,
            z: mapPosition.z,
            time: element.time,
          });
        } else if (element.index == 1) {
          arr.push({
            x: mapPosition.x,
            y: mapPosition.y,
            z: mapPosition.z,
            time: element.time,
          });
        } else if (element.index == 2) {
          arr.push({
            x: mapPosition.x,
            y: mapPosition.y,
            z: mapPosition.z,
            time: element.time,
          });
        }

        if (element.type == "key") {
          if (element.index == 0) {
            element.x = mapPosition.x;
            element.y = mapPosition.y;
            element.z = 15.4;
          } else if (element.index == 1) {
            element.x = mapPosition.x;
            element.y = mapPosition.y;
            element.z = 10.7;
          } else if (element.index == 2) {
            element.x = mapPosition.x;
            element.y = mapPosition.y;
            element.z = 10.9;
          }

          PatrolPoint.push(element);
        }
        if (mapPosition.z < 8) {
          console.log(mapPosition.z);
        }
        if (element.index == 0) {
          polylineArr1.push(mapPosition.x, mapPosition.y, mapPosition.z - 0.1);
        } else if (element.index == 1) {
          polylineArr2.push(mapPosition.x, mapPosition.y, mapPosition.z - 0.1);
        } else if (element.index == 2) {
          polylineArr3.push(mapPosition.x, mapPosition.y, mapPosition.z - 0.1);
        } else if (element.index == 3) {
          if (element.type == "_") {
            upper1 = true;
          }
          if (element.type == "__") {
            upper2 = true;
          }
          if (upper1) {
            if (upper2) {
              polylineArr4.push(mapPosition.x, mapPosition.y, mapPosition.z);
            } else {
              polylineArr4.push(mapPosition.x, mapPosition.y, mapPosition.z);
            }
          } else {
            polylineArr4.push(mapPosition.x, mapPosition.y, mapPosition.z);
          }
        }
      });

      var upper1 = false;
      var upper2 = false;

      timestamp.push(FlightRoamingData[FlightRoamingData.length - 1]);

      // _this.IntelligentRoamingDynamicLine(viewer, polylineArr1);
      // _this.IntelligentRoamingDynamicLine(viewer, polylineArr2);
      // _this.IntelligentRoamingDynamicLine(viewer, polylineArr3);
      var gltf_uri = "/assets/model/scene.gltf";
      if (!webgl_debug) var gltf_uri = "/3D/assets/model/scene.gltf";
      console.log(gltf_uri)
      var entity = VMSDS.core.FlightRoaming(viewer, arr, gltf_uri, 0.01, "IntelligentRoamingV2", "IntelligentRoamingV2");

      entity.path = {
        show: true,
        leadTime: 1,
        width: 25,
        trailTime: 6,
        resolution: 1,
        material: new Cesium.PolylineGlowMaterialProperty({
          //发光线
          glowPower: 0.1,
          color: Cesium.Color.GREEN.withAlpha(1),
        }),
      };

      if (!entity) return;
      var _position = entity.position;
      var _point;
      app_viewer(function (point) {
        _point = point;
      });

      viewer.PatrolPoint = PatrolPoint;

      var worldSpeedCache = 1;
      var InitialTime = { time: null, lock: false };
      viewer.PatrolIndex = 0;
      viewer.scene.postRender.addEventListener(
        (viewer.IntelligentRoaming_EventListener = function (scene, time) {
          if (!Cesium.defined(_position)) {
            return;
          }
          if (Cesium.defined(_point)) {
            _point.position = _position.getValue(time);
          }
          // viewer.PatrolIndex
          if (InitialTime.time == null) {
            InitialTime.time = new Date(time.toString()).getTime();
          } //取初始时间
          var Current_stamp = new Date(time.toString()).getTime();
          var Node_stamp = new Date(timestamp[1].time).getTime();
          if (viewer.PatrolIndex >= PatrolPoint.length) {
            viewer.PatrolIndex--;
          }
          if (Current_stamp >= new Date(PatrolPoint[viewer.PatrolIndex].time.toString()).getTime() - 100) {
            //开始 && !InitialTime.lock

            _this.IntelligentRoaming_Speed({
              multiplier: 0, //当前世界速度 (可整体提高行走速度 必要也可以暂停模型)
            });

            var mapPosition = PatrolPoint[viewer.PatrolIndex];

            var wsc = {
              name: "IntelligentRoaming",
              index: viewer.PatrolIndex,
              position: mapPosition,
              equipment: BackReference(viewer.PatrolIndex),
            };
            window.parent.postMessage(wsc, "*");
            
            if(viewer.IntelligentRoaming_Visual_TOGO_INDEX != 0 && viewer.IntelligentRoaming_Visual_TOGO_INDEX != undefined){
              
              // console.log(viewer.PatrolIndex,BackReference(viewer.PatrolIndex),'PatrolIndex')
              var type = 1;
              //视角5定位点
              if (viewer.PatrolIndex > 13) {
                type = 2;
              }
              if (viewer.PatrolIndex >= 23) {
                type = 3;
              }
              if (viewer.PatrolIndex < 13) {
                type = 1;
              }
              viewer.IntelligentRoaming_Visual_TOGO_INDEX = type;
              if (viewer.IntelligentRoaming_Visual_TOGO) {
                _this.IntelligentRoaming_Visual({ visual: { type: 5 } }, undefined, type);
              }
            }
            viewer.PatrolIndex++;
            setTimeout(() => {
              _this.IntelligentRoaming_Speed({
                multiplier: worldSpeedCache, //当前世界速度 (可整体提高行走速度 必要也可以暂停模型)
              });
            }, nodeTime);
          }

          if (viewer.clock.multiplier != 0) {
            worldSpeedCache = viewer.clock.multiplier;
          } //缓存变速

          if (Current_stamp >= InitialTime.time && !InitialTime.lock) {
            //开始
            // console.log("时间重置判断成立",new Date(Current_stamp).format("yyyy-MM-dd hh:mm:ss"))
            InitialTime.lock = true; //起始锁 开启
            timestamp[timestamp.length - 1].lock = false; //末尾锁 关闭

            viewer.PatrolIndex = 0; //重点坐标重置
            //如下操作是防止短时间内事件重复
            timestamp[1].lock = false;
            timestamp[0].lock = false;
          }
          if (Current_stamp >= new Date(timestamp[timestamp.length - 1].time.toString()).getTime() - 200 && !timestamp[timestamp.length - 1].lock) {
            console.log("时间事件末尾", new Date(Current_stamp));

            timestamp[timestamp.length - 1].lock = true; //末尾锁 开启
            InitialTime.lock = false; //起始锁 关闭

            viewer.PatrolIndex = 0; //重点坐标重置
            //如下操作是防止短时间内事件重复
            timestamp[1].lock = false;
            timestamp[0].lock = false;
          }

          if (Current_stamp > Node_stamp && !timestamp[1].lock) {
            timestamp[1].lock = true; //锁

            // console.log("一楼判断成立")
            Processing_layering(1);
          }

          if (Current_stamp > new Date(timestamp[0].time).getTime() && !timestamp[0].lock) {
            timestamp[0].lock = true; //锁

            Processing_layering(2);
            // console.log("二楼判断成立")
          }

          if (Current_stamp > new Date(timestamp[2].time).getTime() && !timestamp[2].lock) {
            timestamp[2].lock = true; //锁

            // console.log("园外判断成立")
            Processing_layering(3);
          }
        })
      );

      // entity.model.silhouetteColor = Cesium.Color.GREEN; //new Cesium.Color( 1.0 ,  0 ,  0 ,  1.0 );
      // entity.model.silhouetteSize = 1.0;

      viewer.clock.multiplier = multiplier;

      function app_viewer(e) {
        var viewer = VMSDS.control.addOverview("Overview");
        $(".overview-div").append(`
                    <div class="btn-group mb-2" style="position: absolute;bottom: 10%;left: 42%;z-index: 999;">
                    </div>
                `);

        viewer.scene.globe.show = false;
        var settings = {
          //http://127.0.0.1:9730/Dimensional/GetBuildingStructure
          url: "http://" + webgl_server_models_url + "/Dimensional/GetBuildingStructure",
          method: "GET",
          timeout: 0,
          async: false,
        };
        var tileset;
        $.ajax(settings).done(function (data) {
          data = data.datas[0].Routefile.file3Dtiles;
          for (let index = 0; index < data.length; index++) {
            const element = data[index];

            if (element.site != null && element.site != "") {
              if (element.site.indexOf("DX") != -1) {
                tileset = VMSDS.core.add3DTiles(
                  viewer,
                  {
                    // name: "模型",
                    id: element.id,
                    url: element.site.replace("127.0.0.1:9731", webgl_server_uri), //gis.crcr.top:9732
                    flyTo: false,
                    duration: 0,
                    height: 10,
                  },
                  {
                    color: "color('white', 1)",
                    show: true,
                  }
                );
              }
            }
          }
        });
        VMSDS.core.Location(viewer, {
          h: 4.39,
          p: -1.4693372159,
          r: 0,
          x: 120.26685,
          y: 30.294919,
          z: 288.03,
          duration: 0,
        });
        _this.IntelligentRoamingDynamicLine(viewer, polylineArr1);
        _this.IntelligentRoamingDynamicLine(viewer, polylineArr2);
        _this.IntelligentRoamingDynamicLine(viewer, polylineArr3);
        $(".overview-narrow").click();
        var point = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(0, 0),
          clampToGround: true,
          point: {
            pixelSize: 10, //大小
            color: Cesium.Color.YELLOW,
            outlineColor: Cesium.Color.RED, //边框颜色
            outlineWidth: 3, //宽 边框
            disableDepthTestDistance: Number.POSITIVE_INFINITY, //防止被遮挡
          },
        });
        e(point);
        return viewer;
      }
      var _this = this;
      function Processing_layering(type) {
        var modle;
        if (type === 3) {
          VMSDS.GIS.building.forEach(e => {
            if (e.pId === "10" || e.pId === "9" || e.pId === "8" || e.pId === "7") {
              if (e.name == "2") {
                var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 0)",
                });
                em.style = defaultStyle;
              }
            }
          });

          return;
        }
        if (!VMSDS.GIS.building) return;
        VMSDS.GIS.building.forEach(e => {
          switch (type) {
            case 1:
              if (e.name === "一层") {
                var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                modle = em;
              }
              break;
            case 2:
              if (e.name === "二层") {
                var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                modle = em;
              }
              break;
            default:
              return;
          }
        });

        var id;
        var pid;
        pid = modle.element.pId;
        id = modle.element.id;
        if (type === 1) {
          var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
            layer: "layer_2",
          });
          mods.push(VMSDS.core.QueryModel_Entities(VMSDS.GIS, "polylineArr1"));

          mods.forEach(element => {
            if (element) element.show = false;
          });
          var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
            layer: "layer_1",
          });
          mods.push(VMSDS.core.QueryModel_Entities(VMSDS.GIS, "polylineArr2"));

          mods.forEach(element => {
            if (element) element.show = true;
          });
          // 93
          VMSDS.GIS.building.forEach(e => {
            var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
            if (em != null) {
              if (e.name === "一层") {
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 1)",
                });
                em.style = defaultStyle;
              }

              if (e.pId === "93") {
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 1)",
                });
                em.style = defaultStyle;
              }
              if (e.pId === "94" || e.name === "二层" || e.name === "屋顶") {
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 0)",
                });

                em.style = defaultStyle;
              }
            }
          });
        }
        if (type === 2) {
          var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
            layer: "layer_1",
          });
          mods.push(VMSDS.core.QueryModel_Entities(VMSDS.GIS, "polylineArr2"));
          mods.forEach(element => {
            if (element) element.show = false;
          });
          var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
            layer: "layer_2",
          });
          mods.push(VMSDS.core.QueryModel_Entities(VMSDS.GIS, "polylineArr1"));
          mods.forEach(element => {
            if (element) element.show = true;
          });
          // 94
          VMSDS.GIS.building.forEach(e => {
            var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
            if (em != null) {
              if (e.name === "二层") {
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 1)",
                });
                em.style = defaultStyle;
              }

              if (e.pId === "94") {
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 1)",
                });
                em.style = defaultStyle;
              }
              if (e.pId === "93" || e.name === "一层" || e.name === "屋顶") {
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 0)",
                });
                em.style = defaultStyle;
              }
            }
          });
        }
      }
      function BackReference(index) {
        var list = [
          [
            { name: "1#LCU柜", id: "1435148518881800194" },
            { name: "2#LCU柜", id: "1435149385760550913" },
            { name: "3#LCU柜", id: "1435149753278050305" },
            { name: "4#LCU柜", id: "1435150089208246274" },
          ],
          [{ name: "公用LCU柜1", id: "1436253107630669825" }],
          [{ name: "中控室(监控)", id: "" }], //{name: '中控室(监控)',id:""}
          [
            { name: "5#LCU柜", id: "1435150511021010946" },
            { name: "6#LCU柜", id: "1435150764646379522" },
            { name: "7#LCU柜", id: "1435151005139382273" },
            { name: "公用LCU柜2", id: "1436255869214949378" },
          ],
          [
            { name: "1AH1#进线隔离柜", id: "1435146244776308737" },
            { name: "2#10kv进线开关柜", id: "1435144190594953218" },
            { name: "2#10kv计量柜", id: "1435145126826520578" },
            { name: "4AH母线压变柜", id: "1435163084671987713" },
          ],
          [
            { name: "1#电动机柜", id: "1436241650620846082" },
            { name: "2#电动机柜", id: "1436242019547631618" },
            { name: "3#电动机柜", id: "1436242275794440194" },
            { name: "4#电动机柜", id: "1436242783905009665" },
          ],
          [
            { name: "2#站用变柜", id: "1428156867151982593" },
            { name: "母联开关柜", id: "1436243802906972162" },
            { name: "2#进线计量柜", id: "1436244069891198978" },
          ],
          [
            { name: "5#软启柜", id: "1435136131504058370" },
            { name: "6#软启柜", id: "1435136473293697026" },
            { name: "7#软启柜", id: "1435136767373127681" },
          ],
          [
            { name: "1#电容柜", id: "1435137682490568705" },
            { name: "2#电容柜", id: "1435138026926813185" },
            { name: "3#电容柜", id: "1435138273610608641" },
            { name: "4#电容柜", id: "1435138550698913793" },
          ],
          [
            { name: "出线柜", id: "1436248542432755714" },
            { name: "电容柜", id: "1436248844342951938" },
            { name: "125kvA进线柜", id: "1436249160023048194" },
          ],
          [
            { name: "5#无功补偿柜", id: "1435134970092892162" },
            { name: "6#无功补偿柜", id: "1435135259059466241" },
            { name: "7#无功补偿柜", id: "1435135520914059265" },
          ],
          [
            { name: "1#10kv进线隔离柜", id: "1435146244776308737" },
            { name: "1#10kv进线开关柜", id: "1435146512834277377" },
            { name: "1#10kv计量柜", id: "1435146812970283010" },
            { name: "1#10kv母线压变柜", id: "1435160241781125121" },
          ],
          [
            { name: "母联隔离柜", id: "1436240666452578306" },
            { name: "1#所用变柜", id: "1435062679606702081" },
            { name: "5#10kv电动机柜", id: "1436244966817955842" },
            { name: "6#10kv电动机柜", id: "1436246417724178434" },
            { name: "7#10kv电动机柜", id: "1436246731315511297" },
          ],
          [
            { name: "1#清污机", id: "1435125432065241089" },
            { name: "2#清污机", id: "1435125716640378882" },
          ],
          [
            { name: "3#清污机", id: "1435126152793468930" },
            { name: "4#清污机", id: "1435126508797603842" },
          ],
          [{ name: "1#水泵", id: "619534551667965952" }],
          [{ name: "2#水泵", id: "1435054816809234433" }],
          [{ name: "3#水泵", id: "1435055173153107970" }],
          [{ name: "4#水泵", id: "1435055590285029377" }],
          [{ name: "5#水泵", id: "1435056521521180673" }],
          [{ name: "6#水泵", id: "1435057652284567554" }],
          [{ name: "7#水泵", id: "1435058088999694337" }],
          [{ name: "2#皮带机", id: "1436238295605465089" }],
          [{ name: "1#皮带机", id: "1436237362930700290" }],
          [{ name: "", id: "" }],
          [
            { name: "2#启闭机", id: "1435130443943948289" },
            { name: "3#启闭机", id: "1435130143325597698" },
          ],
          [{ name: "外江1 (监控)", id: "" }],
          [{ name: "1#启闭机", id: "1435129452477591553" }],
          [{ name: "外江2 (监控)", id: "" }],
        ];

        if (_this.PumpBodyBuilding != null) {
          if (index === 19 || index === 15) {
            for (var i = 0; i < viewer.scene.primitives.length; i++) {
              var tileset = viewer.scene.primitives.get(i);
              var str = decodeURI(tileset._url);
              if (str.indexOf("水泵建筑体") != -1) {
                _this.PumpBodyBuilding(1, tileset);
                if (index == 19) {
                  setTimeout(() => {
                    _this.PumpBodyBuilding(2, tileset);
                  }, 3000);
                }
              }
            }
          }
          if (index === 22) {
            for (var i = 0; i < viewer.scene.primitives.length; i++) {
              var tileset = viewer.scene.primitives.get(i);
              var str = decodeURI(tileset._url);
              if (str.indexOf("5号楼/建筑/1/") != -1) {
                _this.PumpBodyBuilding(3, tileset);
              }
            }
          }
        }

        return list[index];
        // window.data_popup_list
      }
    }
    //跳转点位
    JumpTimePoint(value) {
      var viewer = VMSDS.GIS;
      if (!Cesium.defined(viewer.PatrolPoint) || !Cesium.defined(value)) {
        return;
      }
      var PatrolIndex = viewer.PatrolIndex == null ? 0 : viewer.PatrolIndex;
      var PatrolPoint = viewer.PatrolPoint;
      var start_time;
      switch (value.type) {
        case "++":
          if (PatrolIndex >= PatrolPoint.length) {
            PatrolIndex = PatrolPoint.length;
          }
          start_time = PatrolPoint[PatrolIndex].time;
          break;
        case "--":
          if (PatrolIndex - 2 <= 0) {
            PatrolIndex = 0;
          } else {
            PatrolIndex -= 2;
          }
          start_time = PatrolPoint[PatrolIndex].time;
          break;
        default:
          return;
      }

      viewer.PatrolIndex = PatrolIndex;
      // console.log(PatrolIndex)
      viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date(start_time));
    }
    /**
     * 刨面
     */
    Planing() {
      const viewer = VMSDS.GIS;
      // Add a clipping plane, a plane geometry to show the representation of the
      // plane, and control the magnitude of the plane distance with the mouse.
      var viewModel = {
        debugBoundingVolumesEnabled: false,
        edgeStylingEnabled: true,
      };

      var scene = viewer.scene;

      var targetY = 0.0;
      var planeEntities = [];
      var selectedPlane;
      var clippingPlanes;

      // Select plane when mouse down
      var downHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      downHandler.setInputAction(function (movement) {
        var pickedObject = scene.pick(movement.position);
        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id) && Cesium.defined(pickedObject.id.plane)) {
          selectedPlane = pickedObject.id.plane;
          selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.05);
          selectedPlane.outlineColor = Cesium.Color.WHITE;
          scene.screenSpaceCameraController.enableInputs = false;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

      // Release plane on mouse up
      var upHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      upHandler.setInputAction(function () {
        if (Cesium.defined(selectedPlane)) {
          selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.1);
          selectedPlane.outlineColor = Cesium.Color.WHITE;
          selectedPlane = undefined;
        }

        scene.screenSpaceCameraController.enableInputs = true;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);

      // Update plane on mouse move
      var moveHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      moveHandler.setInputAction(function (movement) {
        if (Cesium.defined(selectedPlane)) {
          var deltaY = movement.startPosition.y - movement.endPosition.y;
          targetY += deltaY;
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      function createPlaneUpdateFunction(plane) {
        return function () {
          plane.distance = targetY;
          return plane;
        };
      }

      for (var i = 0; i < viewer.scene.primitives.length; i++) {
        var tileset = viewer.scene.primitives.get(i);
        if (tileset.name == "七堡") {
          loadTileset(tileset);
          // break
        }
      }

      function loadTileset(tileset) {
        clippingPlanes = new Cesium.ClippingPlaneCollection({
          planes: [new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, -1.0), 0.0)],
          edgeWidth: viewModel.edgeStylingEnabled ? 1.0 : 0.0,
        });
        tileset.clippingPlanes = clippingPlanes;
        console.log();

        // tileset = viewer.scene.primitives.add(
        //     new Cesium.Cesium3DTileset({
        //         url: url,
        //         clippingPlanes: clippingPlanes,
        //     })
        // );

        tileset.debugShowBoundingVolume = viewModel.debugBoundingVolumesEnabled;
        return tileset.readyPromise
          .then(function () {
            var boundingSphere = tileset.boundingSphere;
            var radius = boundingSphere.radius;

            viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.5, -0.2, radius * 4.0));

            if (!Cesium.Matrix4.equals(tileset.root.transform, Cesium.Matrix4.IDENTITY)) {
              // The clipping plane is initially positioned at the tileset's root transform.
              // Apply an additional matrix to center the clipping plane on the bounding sphere center.
              var transformCenter = Cesium.Matrix4.getTranslation(tileset.root.transform, new Cesium.Cartesian3());
              var transformCartographic = Cesium.Cartographic.fromCartesian(transformCenter);
              var boundingSphereCartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
              var height = boundingSphereCartographic.height - transformCartographic.height;
              clippingPlanes.modelMatrix = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0.0, 0.0, height));
            }

            for (var i = 0; i < clippingPlanes.length; ++i) {
              var plane = clippingPlanes.get(i);
              var planeEntity = viewer.entities.add({
                position: boundingSphere.center,
                plane: {
                  dimensions: new Cesium.Cartesian2(radius * 2.5, radius * 2.5),
                  material: Cesium.Color.WHITE.withAlpha(0.1),
                  plane: new Cesium.CallbackProperty(createPlaneUpdateFunction(plane), false),
                  outline: true,
                  outlineColor: Cesium.Color.WHITE,
                },
              });

              planeEntities.push(planeEntity);
            }
            return tileset;
          })
          .otherwise(function (error) {
            console.log(error);
          });
      }
    }
    /**
     * 漫游展示
     */
    IntelligentRoamingV2(value) {
      const viewer = VMSDS.GIS;
      var timer = value.timer == null ? 10 : value.timer; //模型行走数度

      var FineBezierTimer = value.FineBezierTimer == null ? 0.01 : value.FineBezierTimer; //算法路径速度

      var multiplier = value.multiplier == null ? 1 : value.multiplier; //当前世界速度 (可整体提高行走速度 必要也可以暂停模型)

      var xyList = [
        {
          x: 120.2660368451607,
          y: 30.29511702210979,
          z: 16.55514476881119503647,
        },
        {
          x: 120.2660012287198,
          y: 30.29509367822525,
          z: 16.55509338242417443768,
        },
        {
          x: 120.26601760723695,
          y: 30.295109004174265,
          z: 16.55514562670549335505,
        },
        {
          x: 120.26600421944171,
          y: 30.295123976116074,
          z: 16.55514529707223305552,
        },
        {
          x: 120.26598474223172,
          y: 30.29511147502895,
          z: 16.5551454626685916204,
        },
        {
          x: 120.26597116788176,
          y: 30.29509890590284,
          z: 16.55514507921089263468,
        },
        {
          x: 120.26598547626028,
          y: 30.295081841058693,
          z: 16.55514527920566054266,
        },
        {
          x: 120.26602316551805,
          y: 30.295071551185533,
          z: 16.5551447715129201763,
        },
        {
          x: 120.26602910251187,
          y: 30.295006325370586,
          z: 16.55514530906554580377,
        },
        {
          x: 120.26608257291365,
          y: 30.294978831184494,
          z: 16.55514458461129611335,
        },
        {
          x: 120.26611025414478,
          y: 30.294946745678732,
          z: 16.55514520925468483218,
        },
        {
          x: 120.26608362088439,
          y: 30.295000616403563,
          z: 16.55514563324102921738,
        },
        {
          x: 120.26608816936331,
          y: 30.295012155115316,
          z: 16.55512140273266050463,
        },
        {
          x: 120.26601236388451,
          y: 30.295097235271356,
          z: 16.55514577894154874896,
        },
        {
          x: 120.26603479558496,
          y: 30.295111720433717,
          z: 16.55514500996462973506,
        },
        // , {x: 120.2659945559989, y: 30.29515547666289, z: 16.55514487965367805777}
        // , {x: 120.26600721749382, y: 30.295162936751733, z: 16.55514531696807101123}
        // , {x: 120.2660341951519, y: 30.29513062794965, z: 16.55514427130722174432}
      ];

      var xyFineBezier = [];
      var q = Cesium.Cartesian3.fromDegrees(xyList[0].x, xyList[0].y, 10);
      q.time = timer;
      xyFineBezier.push(q);
      for (let index = 0; index < xyList.length; index++) {
        const element1 = xyList[index];
        const element2 = xyList[index + 1];
        const element3 = xyList[index + 2];
        if (element3 == null) {
          break;
        }
        var a = element1.x - element2.x;
        var b = element1.y - element2.y;
        var c = element2.x + a / 40;
        var d = element2.y + b / 40;

        var e = element2.x - element3.x;
        var f = element2.y - element3.y;
        var g = element2.x - e / 40;
        var h = element2.y - f / 40;

        var dc = new VMSDS.measure.DrawCurve(Cesium, VMSDS.GIS);
        var line = dc.fineBezier(Cesium.Cartesian3.fromDegreesArray([c, d, element2.x, element2.y, element2.x, element2.y, g, h]), 180); //180为弯道点的密度 适当调整可控制转弯速度

        // viewer.entities.add({
        //     polyline: {
        //         positions: line,
        //         width: 5,
        //         material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.BLUE),
        //         clampToGround: true
        //     }
        // })
        // return;

        line[0].time = FineBezierTimer;
        line[line.length - 1].time = timer;
        line.forEach(element => {
          xyFineBezier.push(element);
        });
      }

      // viewer.entities.add({
      //     polyline: {
      //         positions: xyFineBezier,
      //         width: 5,
      //         material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.BLUE),
      //         clampToGround: true
      //     }
      // })

      xyFineBezier.push(Cesium.Cartesian3.fromDegrees(xyList[xyList.length - 1].x, xyList[xyList.length - 1].y, 10));

      var arr = [];
      var i = 0;
      xyList.forEach(e => {
        arr.push(e.x, e.y);
      });
      var alp = 1;
      var num = 0;
      viewer.entities.add({
        type: "IntelligentRoaming",
        polyline: {
          positions: xyFineBezier, //Cesium.Cartesian3.fromDegreesArray(arr),
          width: 26,
          material: new Cesium.PolylineGlowMaterialProperty({
            //发光线
            glowPower: 0.1,
            color: new Cesium.CallbackProperty(function () {
              if (num % 2 === 0) {
                alp -= 0.005;
              } else {
                alp += 0.005;
              }

              if (alp <= 0.2) {
                num++;
              } else if (alp >= 1) {
                num++;
              }
              return Cesium.Color.ORANGE.withAlpha(alp);
              //entity的颜色透明 并不影响材质，并且 entity也会透明
            }, false),
          }),
          clampToGround: true,
        },
      });

      // 动态线
      // VMSDS.effect.DynamicLine(viewer,arr)

      function getTimeList(xyList) {
        var FlightRoamingData = []; //人物漫游时路线数据存储
        var cameraTimer = "04:00:00";
        var mm = timer; //一截路的时长
        for (let index = 0; index < xyList.length; index++) {
          if (Cesium.defined(xyList[index].time)) {
            mm = xyList[index].time;
          }

          const element = xyList[index];

          FlightRoamingData.push({
            id: "roaming_" + index,
            x: element.x,
            y: element.y,
            z: element.z,
            time: ISODateString(new Date()),
            ss: 20, // 停留的时长
          });
          var hour = cameraTimer.split(":")[0];
          var min = cameraTimer.split(":")[1];
          var sec = cameraTimer.split(":")[2];
          var s = Number(hour * 3600) + Number(min * 60) + Number(sec); //加当前相机时间
          function formatTime(s) {
            var t;
            if (s > -1) {
              var hour = Math.floor(s / 3600);
              var min = Math.floor(s / 60) % 60;
              var sec = s % 60;
              if (hour < 10) {
                t = "0" + hour + ":";
              } else {
                t = hour + ":";
              }

              if (min < 10) {
                t += "0";
              }
              t += min + ":";
              if (sec < 10) {
                t += "0";
              }
              t += sec.toFixed(2);
            }
            return t;
          }
          cameraTimer = formatTime(s + mm);
          function ISODateString(d) {
            function pad(n) {
              return n < 10 ? "0" + n : n;
            }
            return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + cameraTimer + "Z";
          }
        }
        return FlightRoamingData;
      }

      xyList = Cesium.Cartesian3.fromDegreesArray(arr);
      var FlightRoamingData = getTimeList(xyFineBezier); //xyFineBezier

      var gltf_uri = "/assets/model/scene.gltf";
      if (!webgl_debug) var gltf_uri = "/3D/assets/model/scene.gltf";

      var czml = [
        {
          id: "document",
          version: "1.0",
          clock: {
            interval: "2018-07-19T15:18:00Z/2018-07-19T15:18:30Z",
            currentTime: "2018-07-19T15:18:00Z",
            multiplier: 1,
            range: "LOOP_STOP",
            step: "SYSTEM_CLOCK_MULTIPLIER",
          },
        },
        {
          id: "CesiumMilkTruck",
          model: {
            gltf: gltf_uri,
            scale: 0.1,
          },
          position: {
            interpolationAlgorithm: "LINEAR",
            forwardExtrapolationType: "HOLD",
            cartesian: [],
          },
          orientation: {
            unitQuaternion: [],
          },
        },
      ];

      czml[1].model.scale = 0.01;

      //添加地形分析及模型行为
      // console.log(Cesium.Transforms.headingPitchRollQuaternion(position, hpr))
      var tileset;
      for (var i = 0; i < viewer.scene.primitives.length; i++) {
        var mod = viewer.scene.primitives.get(i);
        var str = decodeURI(mod._url);

        if (str.indexOf("DX") != -1) {
          tileset = mod;
        }
      }

      var entity = VMSDS.core.GroundRoaming(viewer, this.czmlRoaming(FlightRoamingData, czml), tileset, value.async == null ? true : value.async);
      if (!entity) return;

      //自动计算模型朝向
      var data = FlightRoamingData;
      var property = new Cesium.SampledPositionProperty();
      for (var i = 0, len = data.length; i < len; i++) {
        var item = data[i];

        var lng = item.x;
        var lat = item.y;
        var hei = item.z;
        var time = item.time;

        var position = null;
        if (lng && lat) position = Cesium.Cartesian3.fromDegrees(lng, lat, hei);

        var juliaDate = null;
        if (time) juliaDate = Cesium.JulianDate.fromIso8601(time);

        if (position && juliaDate) property.addSample(juliaDate, position);
      }

      entity.position = property;
      entity.orientation = new Cesium.VelocityOrientationProperty(property);
      // entity.model.silhouetteColor = Cesium.Color.GREEN; //new Cesium.Color( 1.0 ,  0 ,  0 ,  1.0 );
      // entity.model.silhouetteSize = 3.0;
      entity.type = "IntelligentRoaming";

      viewer.clock.multiplier = multiplier;

      var _this = this;
      function app_viewer() {
        var viewer = VMSDS.control.addOverview("Overview");
        $(".overview-div").append(`
                <div class="btn-group mb-2" style="position: absolute;bottom: 10%;left: 42%;z-index: 999;">
                </div>
            `);

        viewer.scene.globe.show = false;
        var settings = {
          //http://127.0.0.1:9730/Dimensional/GetBuildingStructure
          url: "http://" + webgl_server_models_url + "/Dimensional/GetBuildingStructure",
          method: "GET",
          timeout: 0,
          async: false,
        };
        var tileset;
        $.ajax(settings).done(function (data) {
          data = data.datas[0].Routefile.file3Dtiles;
          for (let index = 0; index < data.length; index++) {
            const element = data[index];

            if (element.site != null && element.site != "") {
              if (element.site.indexOf("DX") != -1) {
                tileset = VMSDS.core.add3DTiles(
                  viewer,
                  {
                    // name: "模型",
                    id: element.id,
                    url: element.site.replace("127.0.0.1:9731", webgl_server_uri), //gis.crcr.top:9732
                    flyTo: false,
                    duration: 0,
                    height: 10,
                  },
                  {
                    color: "color('white', 1)",
                    show: true,
                  }
                );

                VMSDS.core.Location(viewer, {
                  h: 5.98,
                  p: -0.4620486427,
                  r: 6.28,
                  x: 120.267191,
                  y: 30.293718,
                  z: 79.57,
                  duration: 0,
                });
                viewer.entities.add({
                  type: "IntelligentRoaming",
                  polyline: {
                    positions: xyFineBezier, //Cesium.Cartesian3.fromDegreesArray(arr),
                    width: 26,
                    material: new Cesium.PolylineGlowMaterialProperty({
                      //发光线
                      glowPower: 0.1,
                      color: new Cesium.CallbackProperty(function () {
                        if (num % 2 === 0) {
                          alp -= 0.005;
                        } else {
                          alp += 0.005;
                        }

                        if (alp <= 0.2) {
                          num++;
                        } else if (alp >= 1) {
                          num++;
                        }
                        return Cesium.Color.ORANGE.withAlpha(alp);
                        //entity的颜色透明 并不影响材质，并且 entity也会透明
                      }, false),
                    }),
                    clampToGround: true,
                  },
                });
                $(".overview-narrow").click();
                var point = viewer.entities.add({
                  position: Cesium.Cartesian3.fromDegrees(0, 0),
                  clampToGround: true,
                  point: {
                    pixelSize: 10, //大小
                    color: Cesium.Color.YELLOW,
                    outlineColor: Cesium.Color.RED, //边框颜色
                    outlineWidth: 3, //宽 边框
                    disableDepthTestDistance: Number.POSITIVE_INFINITY, //防止被遮挡
                  },
                });

                viewer.scene.postUpdate.addEventListener(function (scene, time) {
                  if (!Cesium.defined(entity.position)) {
                    return;
                  }

                  var position = entity.position.getValue(time);
                  point.position = position;

                  // setInterval(() => {
                  //     var x = new VMSDS.util.getCameraView(viewer);
                  //     console.log(x)
                  // }, 1000);
                  // console.log(position)
                });
              }
            }
          }
        });

        return viewer;
      }
      app_viewer();
    }

    czmlRoaming(position, czml) {
      var p = [];
      //    console.log(clock)//Cesium.JulianDate.fromDate(new Date());
      var _start;
      var _stop;
      var property = new Cesium.SampledPositionProperty();
      //debugger;
      for (var i = 0, len = position.length; i < len; i++) {
        var item = position[i];
        var cartographic = Cesium.Cartographic.fromCartesian(item);
        var lng = Cesium.Math.toDegrees(cartographic.longitude);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var mapPosition = { x: lng, y: lat, z: cartographic.height };
        item.x = mapPosition.x;
        item.y = mapPosition.y;
        item.z = mapPosition.z;

        var lng = Number(item.x.toFixed(6));
        var lat = Number(item.y.toFixed(6));
        var hei = item.z;
        var time = item.time;

        var _position = null;
        if (lng && lat) _position = Cesium.Cartesian3.fromDegrees(lng, lat, hei);

        var juliaDate = null;
        if (time) juliaDate = Cesium.JulianDate.fromIso8601(time);

        if (_position && juliaDate) property.addSample(juliaDate, _position);

        if (i == 0) _start = juliaDate;
        else if (i == len - 1) _stop = juliaDate;
      }
      // console.log(_start.clone().toString())

      /* Use a function for the exact format desired... */
      function ISODateString(d) {
        function pad(n) {
          return n < 10 ? "0" + n : n;
        }
        return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + "Z";
      }

      czml[0].clock.interval = ISODateString(new Date(_start.clone().toString())) + "/" + ISODateString(new Date(_stop.clone().toString()));
      czml[0].clock.startTime = ISODateString(new Date(_start.clone().toString()));
      czml[0].clock.stopTime = ISODateString(new Date(_stop.clone().toString()));
      czml[0].clock.currentTime = ISODateString(new Date(_start.clone().toString()));
      czml[0].clock.clockRange = Cesium.ClockRange.LOOP_STOP;
      czml[0].clock.multiplier = 1.0;

      for (let index = 0; index < position.length; index++) {
        const element = position[index];
        var cartesian = Cesium.Cartesian3.fromDegrees(element.x, element.y, 10);
        p.push(ISODateString(new Date(element.time)), cartesian.x, cartesian.y, cartesian.z);
      }
      //    console.log(p)
      czml[1].position.cartesian = p;
      //    console.log(czml,czml[1].position.cartesian)
      return czml;
    }

    //销毁漫游
    IntelligentRoaming_Destroy() {
      const viewer = VMSDS.GIS;

      VMSDS.GIS.RoamingStatus == false; //解除防冲突

      window.mousePosition = function (ev) {
        //解除防冲突 （移动侦测事件等）
        if (ev.pageX || ev.pageY) {
          //firefox、chrome等浏览器
          return { x: ev.pageX, y: ev.pageY };
        }
        return {
          // IE浏览器
          x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
          y: ev.clientY + document.body.scrollTop - document.body.clientTop,
        };
      };

      viewer.scene.postRender.removeEventListener(viewer.IntelligentRoaming_EventListener); //接触移动计算事件

      viewer.scene.preRender.removeEventListener(viewer.roamingBubbles);
      $("#htmlOverlay").hide(); //漫游气泡

      var setvisible = VMSDS.effect.runshineAnalysis();
      setvisible(viewer, "stop"); //stop

      viewer.building.forEach(e => {
        var em = VMSDS.core.QueryModel_Scene(viewer, e.id);
        var defaultStyle = new Cesium.Cesium3DTileStyle({
          color: "color('white', 1)",
        });

        if (Cesium.defined(em)) {
          em.style = defaultStyle;
        }
      });

      $(".overview-close").click();

      /**
       * 视角释放
       */
      viewer.IntelligentRoaming_Visual_TOGO = false;
      viewer.scene.postUpdate.removeEventListener(viewer.IntelligentRoaming_VisualEvent);
      viewer.trackedEntity = undefined;
      viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
      /**
       * 销毁路径 及 人物模型
       */
      var mods = VMSDS.core.QueryModel_Entities_x(viewer, {
        type: "IntelligentRoaming",
      });
      if (mods.length >= 1) {
        VMSDS.core.RemoveEntities(viewer, mods);
      }
      /**
       * 销毁路径 及 人物模型
       */
      var mods = VMSDS.core.QueryModel_Entities_x(viewer, {
        type: "IntelligentRoamingV2",
      });
      if (mods.length >= 1) {
        VMSDS.core.RemoveEntities(viewer, mods);
      }

      viewer.dataSources.removeAll();
      /**
       * 初始化时间及还原时间速率
       */
      viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date());
      viewer.clock.multiplier = 1;
      viewer.clock.worldSpeedCache = viewer.clock.multiplier;
      var tileset = VMSDS.core.QueryModel_Scene(viewer, "56c3c6913322484a892c2b9113918d97");
      if (!Cesium.defined(tileset)) {
        return;
      }
      tileset.initialTilesLoaded.removeEventListener(viewer.GroundRoaming_EventListener);
      viewer.scene.postRender.removeEventListener(viewer.GroundRoaming_Start_EventListener);
    }
    //行走速度控制
    IntelligentRoaming_Speed(value) {
      const viewer = VMSDS.GIS;
      viewer.clock.multiplier = value.multiplier;
      viewer.clock.worldSpeedCache = viewer.clock.multiplier;
    }
    //视角
    IntelligentRoaming_Visual(value, _entity, to_go) {
      const viewer = VMSDS.GIS;
      viewer.IntelligentRoaming_Visual_TOGO = false;
      viewer.scene.postUpdate.removeEventListener(VMSDS.GIS.IntelligentRoaming_VisualEvent);
      viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
      viewer.trackedEntity = undefined;
      function get_entity(viewer) {
        for (let index = 0; index < viewer.dataSources._dataSources.length; index++) {
          const element = viewer.dataSources._dataSources[index];
          if (!Cesium.defined(element.entities._entities._array)) {
            return;
          }

          for (let i = 0; i < element.entities._entities._array.length; i++) {
            const e = element.entities._entities._array[i];
            if (e.type == "IntelligentRoaming") {
              return e;
            }
          }
        }
      }

      var entity = get_entity(viewer);
      if (_entity != null) {
        entity = _entity;
      }
      if (entity == null) {
        entity = VMSDS.core.QueryModel_Entities_x(VMSDS.GIS, {
          type: "IntelligentRoamingV2",
        })[0];
      }
      if (entity == null) {
        return;
      }
      var visual =
        value.visual == null
          ? {
              type: 2,
              zoomTo: false,
            }
          : value.visual; //视角 0是无绑定 1是第一人称 3是第三人称 2是跟随

      var _this = this;
      VMSDS.GIS.IntelligentRoaming_VisualEvent = function (scene, time) {
        if (!Cesium.defined(entity.position)) {
          return;
        }

        var position = entity.position.getValue(time);
        var camera = viewer.camera;
        switch (visual.type) {
          case 3:
            camera.position = new Cesium.Cartesian3(-5, -0, value.visual.height == null ? 10.435945991426706 : value.visual.height);
            camera.direction = new Cesium.Cartesian3(0.3987584249598806, 0.009354600409072824, value.visual.direction == null ? Cesium.Math.toRadians(-65) : Cesium.Math.toRadians(value.visual.direction));
            camera.up = new Cesium.Cartesian3(0.916756064443912, 0.021506470654472087, 0.39886813613686706);
            camera.right = new Cesium.Cartesian3(0.02345286397916243, -0.9997249437576193, -2.908438299226157);
            break;
          case 2:
            //绑定方式
            viewer.trackedEntity = entity;
            break;
          case 1:
            camera.position = new Cesium.Cartesian3(0, 0.0, 1.5); //位置一是前后视距
            camera.direction = new Cesium.Cartesian3(1.0, 0.0, Cesium.Math.toRadians(0));
            camera.up = new Cesium.Cartesian3(0.0, 0.0, 1.0);
            camera.right = new Cesium.Cartesian3(0.0, -1.0, 0.0);
            break;
          case 4:
            viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(120.266681, 30.294777, 247.12),
              orientation: {
                heading: 4.42,
                pitch: -1.5025040799,
                roll: 6.28,
              },
              duration: 0,
            });
            return;
          case 5:
            
            go();
            _this.IntelligentRoaming_Visual({ visual: { type: 5 } }, undefined, viewer.IntelligentRoaming_Visual_TOGO_INDEX ?? 1);
            return;
        }
        function go() {
          viewer.IntelligentRoaming_Visual_TOGO = true;
          if (to_go) {
            switch (to_go) {
              case 1:
                viewer.camera.flyTo({
                  destination: Cesium.Cartesian3.fromDegrees(120.266093, 30.295095, 65.19),
                  orientation: {
                    heading: 4.12,
                    pitch: -1.4805012222,
                    roll: 6.28,
                  },
                  duration: 0,
                });

                break;
              case 2:
                viewer.camera.flyTo({
                  destination: Cesium.Cartesian3.fromDegrees(120.266505, 30.29498, 75.78),
                  orientation: {
                    heading: 3.01,
                    pitch: -1.5070690559,
                    roll: 0,
                  },
                  duration: 0,
                });

                break;
              case 3:
                viewer.camera.flyTo({
                  destination: Cesium.Cartesian3.fromDegrees(120.266773, 30.294099, 124.84),
                  orientation: {
                    heading: 2.88,
                    pitch: -1.4625603774,
                    roll: 6.28,
                  },
                  duration: 0,
                });

                break;
            }
          }
        }
        if (!Cesium.defined(position)) {
          return;
        }

        var transform;
        if (!Cesium.defined(entity.orientation)) {
          transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        } else {
          var orientation = entity.orientation.getValue(time);
          if (!Cesium.defined(orientation)) {
            return;
          }

          transform = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation), position);
        }

        // Save camera state
        var offset = Cesium.Cartesian3.clone(camera.position);
        var direction = Cesium.Cartesian3.clone(camera.direction);
        var up = Cesium.Cartesian3.clone(camera.up);

        // Set camera to be in model's reference frame.
        camera.lookAtTransform(transform);

        // Reset the camera state to the saved state so it appears fixed in the model's frame.
        Cesium.Cartesian3.clone(offset, camera.position);
        Cesium.Cartesian3.clone(direction, camera.direction);
        Cesium.Cartesian3.clone(up, camera.up);
        Cesium.Cartesian3.cross(direction, up, camera.right);
      };

      if (visual.type != 0) {
        viewer.scene.postUpdate.addEventListener(VMSDS.GIS.IntelligentRoaming_VisualEvent);
      }

      if (visual.type == 2) {
        viewer.zoomTo(entity, new Cesium.HeadingPitchRange(Cesium.Math.toRadians(-100), Cesium.Math.toRadians(-65), 20));
      }
    }
    /**
     * 定位七个泵体
     */
    example_positioning_pump(index) {
      if (this.example_positioning_camera(index)) {
        return;
      }
      clearInterval(VMSDS.GIS.OffsetAlarmEffect);

      // window.mousePosition = function(ev) {//漫游防冲突
      //     return {// IE浏览器
      //         x: 0,
      //         y: 0
      //     };
      // }

      var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
        name: "OffsetAlarmEffect",
      });
      mods.forEach(element => {
        VMSDS.GIS.scene.primitives.remove(element);
      });

      var arr = window.data_popup_list;
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element.id == index) {
          element.hpr.duration = 3;
          VMSDS.core.Location(VMSDS.GIS, element.hpr); //定位坐标
          return;
        }
      }
      if (arr[index] == null) {
        console.warn("不存在", index);
      }
      arr[index].hpr.duration = 3;

      console.log(arr[index].layer);
      if (arr[index].layer == "layer_1") {
        Processing_layering(1);
      } else if (arr[index].layer == "layer_2") {
        Processing_layering(2);
      }
      var _this = this;
      function Processing_layering(type) {
        var modle;
        if (type === 3) {
          VMSDS.GIS.building.forEach(e => {
            if (e.pId === "10" || e.pId === "9" || e.pId === "8" || e.pId === "7") {
              if (e.name == "2") {
                var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 0)",
                });
                em.style = defaultStyle;
              }
            }
          });

          return;
        }

        VMSDS.GIS.building.forEach(e => {
          switch (type) {
            case 1:
              if (e.name === "一层") {
                var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                modle = em;
              }
              break;
            case 2:
              if (e.name === "二层") {
                var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                modle = em;
              }
              break;
            default:
              return;
          }
        });

        var id;
        var pid;
        pid = modle.element.pId;
        id = modle.element.id;
        if (type === 1) {
          var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
            layer: "layer_2",
          });
          mods.push(VMSDS.core.QueryModel_Entities(VMSDS.GIS, "polylineArr1"));
          mods.forEach(element => {
            if (element) element.show = false;
          });
          var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
            layer: "layer_1",
          });
          mods.push(VMSDS.core.QueryModel_Entities(VMSDS.GIS, "polylineArr2"));
          mods.forEach(element => {
            if (element) element.show = true;
          });
          // 93
          VMSDS.GIS.building.forEach(e => {
            var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
            if (em != null) {
              if (e.name === "一层") {
                em.show_ = true;

                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 1)",
                });
                em.style = defaultStyle;
              }

              if (e.pId === "93") {
                em.show_ = true;
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 1)",
                });
                em.style = defaultStyle;
              }
              if (e.pId === "94" || e.name === "二层" || e.name === "屋顶") {
                em.show_ = true;

                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 0)",
                });

                em.style = defaultStyle;
              }
            }
          });
        }
        if (type === 2) {
          var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
            layer: "layer_1",
          });
          mods.push(VMSDS.core.QueryModel_Entities(VMSDS.GIS, "polylineArr2"));
          mods.forEach(element => {
            if (element) element.show = false;
          });
          var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
            layer: "layer_2",
          });
          mods.push(VMSDS.core.QueryModel_Entities(VMSDS.GIS, "polylineArr1"));
          mods.forEach(element => {
            if (element) element.show = true;
          });
          // 94
          VMSDS.GIS.building.forEach(e => {
            var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
            if (em != null) {
              if (e.name === "二层") {
                em.show_ = true;
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 1)",
                });
                em.style = defaultStyle;
              }

              if (e.pId === "94") {
                em.show_ = true;
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 1)",
                });
                em.style = defaultStyle;
              }
              if (e.pId === "93" || e.name === "一层" || e.name === "屋顶") {
                em.show_ = true;
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 0)",
                });
                em.style = defaultStyle;
              }
            }
          });
        }
      }
      // var tileset =  VMSDS.core.AddModel(VMSDS.GIS,{
      //     url: './assets/model/带边框三角.gltf',
      //     scale:0.5,
      //     x:arr[index].x,
      //     y:arr[index].y,
      //     z:arr[index].z
      // });
      // tileset.name = 'OffsetAlarmEffect'
      // VMSDS.core.Highlight(tileset)
      // var start = false;
      // var heightOffsetAlarmEffect = 0;var headingAlarmEffect = 0
      // VMSDS.GIS.OffsetAlarmEffect = setInterval(function () {

      //     if(heightOffsetAlarmEffect >= 1){
      //         start = false;
      //     }
      //     if(heightOffsetAlarmEffect <= 0){
      //         start = true;
      //     }
      //     if(!start){
      //         heightOffsetAlarmEffect = heightOffsetAlarmEffect - 0.02;
      //     }else{
      //         heightOffsetAlarmEffect  = heightOffsetAlarmEffect + 0.02;
      //     }
      //     if(headingAlarmEffect >= 6.28){
      //         headingAlarmEffect = 0;
      //     }

      //     headingAlarmEffect  = headingAlarmEffect + 0.04;
      //     // console.log(heading)
      //     var hpr = new Cesium.HeadingPitchRoll(headingAlarmEffect,0, 0);
      //     var origin = Cesium.Cartesian3.fromDegrees(arr[index].x, arr[index].y, arr[index].z + heightOffsetAlarmEffect);
      //     var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(origin, hpr);
      //     tileset.modelMatrix = modelMatrix;

      // }, 20);

      VMSDS.core.Location(VMSDS.GIS, arr[index].hpr); //定位坐标
    }

    /***
     * 展示气泡
     */
    example_pump_popup(value) {
      var viewer = VMSDS.GIS;

      if (value == null) {
        value = {};
      }
      var index = null;

      var arr = window.data_popup_list;
      if (arr[value.index]) {
        index = value.index;
      }
      // console.log(arr[value.index],value.index,arr)
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (value.index == element.id) {
          index = i;
        }
      }

      var _this = this;
      if (_this.MovePromptList == null) _this.MovePromptList = [];
      var organism_xy = [];

      var arr = window.data_popup_list;
      if (index == null && value.index !== "*") {
        // organism_xy = arr
        console.warn("不存在", value.index);
        return;
      } else if (value.index === "*") {
        organism_xy = arr;
      } else {
        organism_xy.push(arr[index]);
      }
      // _this.MovePromptList.forEach(element => {
      //     element.setVisible(false)
      // });
      for (let index = 0; index < organism_xy.length; index++) {
        const organism_ = organism_xy[index];
        //展示当前设备
        _this.MovePromptList.forEach(element => {
          if (element.id == organism_.id) element.setVisible(true);
        });
      }

      var dj = "-webkit-animation-name: commonly;";
      switch (1) {
        case 1:
          dj = "-webkit-animation-name: commonly;";
          break;
        case 2:
          dj = "-webkit-animation-name: secondary;";
          break;
        case 3:
          dj = "-webkit-animation-name: urgent;";
          break;
      }
      for (let index = 0; index < organism_xy.length; index++) {
        const organism_ = organism_xy[index];

        var click = "window.parent.postMessage({name : 'example_pump_popup_normal',type:'click',ButtonId : '" + organism_.id + "'} , '*');";
        var content =
          `<div style="border-top: 23px solid #0a1f31ba;
                border-right: 20px solid transparent;
                width: 200px;
                bottom: 0px;">
                <div style="position: absolute;bottom: 42px;left: 24px; ` +
          dj +
          `" class="breathe-div"></div>
                <div style="color: #fff;cursor: pointer;position: absolute;bottom: 37px;left: 54px;" onclick="` +
          click +
          `">` +
          organism_.name +
          `<div/>
                </div>`;

        function isRepeat() {
          var r = true;
          _this.MovePromptList.forEach(element => {
            if (element.id === organism_.id) r = false;
          });
          return r;
        }
        var html = [
          '<div id="' +
            "this.trackPopUpContentId" +
            '" class="cesium-popup" style="top:0;left:0;">' +
            '<div class="cesium-prompt-content-wrapper" id="' +
            "this.promptDivId" +
            '">' +
            '<div id="trackPopUpLink" class="cesium-popup-content" style="">' +
            '<span class="promptContent" id="' +
            "this.promptContentId" +
            '">' +
            "this.content" +
            "</span>" +
            "</div>" +
            "</div>" +
            "</div>",
          '<div id="' +
            "this.trackPopUpContentId" +
            '" class="cesium-popup" style="top:0;left:0;">' +
            '<a class="cesium-popup-close-button" href="javascript:void(0)" id="' +
            "this.closeBtnId" +
            '">×</a>' +
            '<div class="cesium-popup-content-wrapper" id="' +
            "this.promptDivId" +
            '">' +
            '<div id="trackPopUpLink" class="cesium-popup-content" style="">' +
            '<span class="popupContent" id="' +
            "this.promptContentId" +
            '">' +
            "this.content" +
            "</span>" +
            "</div>" +
            "</div>" +
            '<div class="cesium-popup-tip-container">' +
            '<div class="cesium-popup-tip"></div>' +
            "</div>" +
            "</div>",
        ];

        if (isRepeat()) {
          var popup = VMSDS.core.bubbleBombbox(
            viewer,
            {
              x: organism_.x,
              y: organism_.y,
              z: organism_.z,
              content: content,
            },
            html
          );
          popup.id = organism_.id;

          _this.MovePromptList.push(popup);
        }
      }

      if (!viewer._pump_popup_state) {
        viewer._pump_popup_state = true;
 
        viewer.scene.postRender.addEventListener(function () {
          _this.MovePromptList.forEach(element => {
            // console.log(element.infoDiv)
            element.infoDiv.style.visibility = "hidden";


            var cartographic = Cesium.Cartographic.fromCartesian(element.popupCartesian);
            var lng = Cesium.Math.toDegrees(cartographic.longitude);
            var lat = Cesium.Math.toDegrees(cartographic.latitude);
            var mapPosition = { x: lng, y: lat, z: cartographic.height };
  
            // var data = {
            //   position: viewer.camera.position,
            //   heading: viewer.camera.heading,
            //   pitch: viewer.camera.pitch
            // }
            
            var data_cartographic = Cesium.Cartographic.fromCartesian(viewer.camera.position);
            var data_lng = Cesium.Math.toDegrees(data_cartographic.longitude);
            var data_lat = Cesium.Math.toDegrees(data_cartographic.latitude);
            var data_Position = { x: data_lng, y: data_lat, z: data_cartographic.height };
  
            // console.log(data.position)  //当前视角
            var satrt = Cesium.Cartographic.fromDegrees(mapPosition.x, mapPosition.x, mapPosition.z)//Cesium.Cartographic.fromDegrees(117.270739, 31.84309, 500);
            var end =  Cesium.Cartographic.fromDegrees(data_Position.x, data_Position.x, data_Position.z);
  
            //计算两点直接多少米
            function disTance(satrt, end) {
              var geodesic = new Cesium.EllipsoidGeodesic();
              geodesic.setEndPoints(satrt, end);
              var s = geodesic.surfaceDistance;
              s = Math.sqrt(Math.pow(s, 2) + Math.pow(end.height - satrt.height, 2));
              return s.toFixed(2);
            }
            // console.log(Number(disTance(satrt, end)))
            if(element.grade==3){
              element.infoDiv.style.visibility = "";
            }
            if(Number(disTance(satrt, end)) <= 50){//拉近再显示
              element.infoDiv.style.visibility = "";
            }
            // console.log(data_Position,mapPosition, disTance(satrt, end));
            // return
          });
        });
      }
    }

    /***
     * 显示隐藏七个泵体的气泡
     */
    example_popup_setVisible(value) {
      if (this.example_camera_setVisible(value)) {
        return;
      }
      var _this = this;
      if (_this.MovePromptList == null) _this.MovePromptList = [];
      var organism_xy = [];

      var arr = window.data_popup_list;
      if (value.index == null) {
        organism_xy = arr;
      } else {
        if (arr[value.index]) {
          organism_xy.push(arr[value.index]);
        }
        for (let i = 0; i < arr.length; i++) {
          const element = arr[i];
          if (element.id == value.index) {
            organism_xy.push(arr[i]);
          }
        }
      }

      for (let index = 0; index < organism_xy.length; index++) {
        const organism_ = organism_xy[index];
        //展示当前设备
        _this.MovePromptList.forEach(element => {
          if (element.id == organism_.id) {
            element.setVisible(value.visible == null ? false : value.visible);
          }
        });
      }
    }

    /***
     * 更新泵体的气泡
     */
    example_popup_update(value) {
      var _this = this;
      if (_this.MovePromptList == null) _this.MovePromptList = [];
      var organism_xy = [];

      var arr = window.data_popup_list;

      var index = null;
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element.id == value.index) {
          index = i;
        }
      }

      if (index == null) {
        // organism_xy = arr
        console.warn("不存在", value.index);
        return;
      } else {
        organism_xy.push(arr[index]);
      }
      for (let index = 0; index < organism_xy.length; index++) {
        const organism_ = organism_xy[index];
        //展示当前设备
        for (let i = 0; i < _this.MovePromptList.length; i++) {
          const element = _this.MovePromptList[i];
          if (element.id == organism_.id) {
            var click = "window.parent.postMessage({name : 'example_pump_popup',type:'click',ButtonId : '" + organism_.id + "'} , '*');";

    
            var html = [
              '<div id="' +
                "this.trackPopUpContentId" +
                '" class="cesium-popup" style="top:0;left:0;">' +
                '<div class="cesium-prompt-content-wrapper" id="' +
                "this.promptDivId" +
                '">' +
                '<div id="trackPopUpLink" class="cesium-popup-content" style="">' +
                '<span class="promptContent" id="' +
                "this.promptContentId" +
                '">' +
                "this.content" +
                "</span>" +
                "</div>" +
                "</div>" +
                "</div>",
              '<div id="' +
                "this.trackPopUpContentId" +
                '" class="cesium-popup" style="top:0;left:0;">' +
                '<a class="cesium-popup-close-button" href="javascript:void(0)" id="' +
                "this.closeBtnId" +
                '">×</a>' +
                '<div class="cesium-popup-content-wrapper" id="' +
                "this.promptDivId" +
                '">' +
                '<div id="trackPopUpLink" class="cesium-popup-content" style="">' +
                '<span class="popupContent" id="' +
                "this.promptContentId" +
                '">' +
                "this.content" +
                "</span>" +
                "</div>" +
                "</div>" +
                '<div class="cesium-popup-tip-container">' +
                '<div class="cesium-popup-tip"></div>' +
                "</div>" +
                "</div>",
            ];

            var content1 =
              `<div style="">
                        <div style=;" onclick="` +
              click +
              `">` +
              value.txt +
              `<div/>
                        </div>`;

                        
            var content2 =
              `<div style="">
                            <div style=" " onclick="` +
              click +
              `">` +
              value.header +
              `
                            <div style="">` +
              value.text1 +
              `</div>
                            <div style="">` +
              value.text2 +
              `</div>
                            <div style="">` +
              value.text3 +
              `</div><div/>
                            <div class="popupButton" style="" onclick="window.parent.postMessage({name : 'example_pump_popup',type:'click',type : '1',ButtonId : '` +
              organism_.id +
              `',diagnosis : '` +
              value.diagnosis +
              `',deal_type:'` +
              value.deal_type +
              `',value:'` +
              value +
              `'} , '*');">查看</div>
                            <div class="popupButton" style="" onclick="window.parent.postMessage({name : 'example_pump_popup',type:'click',type : '2',ButtonId : '` +
              organism_.id +
              `',diagnosis : '` +
              value.diagnosis +
              `',deal_type:'` +
              value.deal_type +
              `',recordId:'` +
              value.recordId +
              `',equipmentName:'` +
              value.equipmentName +
              `',value:'` +
              value +
              `'} , '*');">处理</div>
                        </div>`;

            var content3 =
            `
            <div class="box9" style="box-shadow: 0px 0px 10px #d93f3f;
            border-radius:5px;
            color: #fff;
            position: absolute;
            top: 94px;
            left: 38px;
            height: 34px;
            background-color: #ff4242b3;
            width: 166px;
            backdrop-filter: blur(10px);
                ">
                  <div title="${value.header}:${value.equipmentName}"  class="section4 flex-row justify-between" style="width: 91px !important;overflow: hidden !important;white-space: nowrap !important;
                  text-overflow: ellipsis !important;padding: 8px 0 0 10px;font-size: 12px; font-weight: 700;
                  height: 21px;">
                    <span style=" " class="word30" >${value.header}:${value.equipmentName}</span>
                    <div class="popupButton" style="width: 49px;z-index:999;color: #fff;cursor: pointer;position: absolute;top: 5px;left: 105px;" onclick="window.parent.postMessage({name : 'example_pump_popup',type:'click',type : '2',ButtonId : '` +
                    organism_.id +
                    `',diagnosis : '` +
                    value.diagnosis +
                    `',deal_type:'` +
                    value.deal_type +
                    `',recordId:'` +
                    value.recordId +
                    `',equipmentName:'` +
                    value.equipmentName +
                    `',value:'` +
                    value +
                    `'} , '*');">查看</div>
                  </div>
                </div>
            `;

            var content = content1;
            switch (value.popupIndex) {
              case 0:
                content = content2;
                break;
              case 1:
                content = content3;
                break;
            }
            element.destroy(); //销毁
            if (value.popupIndex == null) {
              value.popupIndex = 1;
            }
            var popup = VMSDS.core.bubbleBombbox(
              VMSDS.GIS,
              {
                x: organism_.x,
                y: organism_.y,
                z: organism_.z,
                content: content,
              },
              html
            );
            popup.id = organism_.id;
            popup.grade = value.grade
            _this.MovePromptList[i] = popup;

            var _uri = "/assets/";
            if (!webgl_debug) var _uri = "/3D/assets/";
      
            if(value.grade == 3){
              $('.cesium-popup-tip').css("width","42px")
              $('.cesium-popup-tip').css("height","66px")   
              $('.cesium-popup-tip').css("background","url("+_uri+"img/SketchPng81163012e300ac28626489dc45bbcffd1198c2ee21675eea56fecfb50fdb09c3.png) 0px 1px no-repeat")
              $('.cesium-popup-tip').css("box-shadow","0 3px 14px rgb(0 0 0 / 0%)")
              $('.cesium-popup-tip').css("transform","none")
              $('.cesium-popup-tip').css("margin","0px auto 0")
              $('.cesium-popup-tip-container').css("height","66px")
    
            }


            switch (value.popupIndex) {
              case 0:
                // $(".cesium-popup-tip").css("background","#ff4b61");
                break;
              default:
                // $(".cesium-popup-tip").css("background","#0a1f31ba");
                break;
            }
          }
        }
      }
    }
    /***
     * 事件扩散效果
     */
    example_event_spread(value) {
      var _this = this;
      if (_this.event_spreadList == null) _this.event_spreadList = [];

      var arr = window.data_popup_list;

      var index = null;
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element.id == value.index) {
          index = i;
        }
      }

      if (index == null) {
        console.warn("不存在", value.index);
        return;
      }

      function isRepeat() {
        var r = true;
        _this.event_spreadList.forEach(element => {
          if (element.id === arr[index].id) r = false;
        });
        return r;
      }
      if (isRepeat()) {
        var mode = VMSDS.effect.Spread(VMSDS.GIS, {
          x: arr[index].x,
          y: arr[index].y,
          z: 100,
          size: 2,
        });
        mode.id = arr[index].id;
        _this.event_spreadList[index] = mode;
      }
    }
    //销毁事件
    example_event_spread_destroy(value) {
      var _this = this;
      if (_this.event_spreadList == null) _this.event_spreadList = [];

      var arr = window.data_popup_list;
      var index = null;
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element.id == value.index) {
          index = i;
        }
      }

      if (index == null) {
        console.warn("不存在", value.index);
        return;
      }

      VMSDS.GIS.scene.postProcessStages.remove(_this.event_spreadList[index]);
    }
    //#endregion
    //隐藏Video
    DisplayVideo() {
      var trailerBl = true;
      var videoElement = document.getElementById("trailer");
      if (trailerBl) {
        trailerBl = false;
        videoElement.style.display = "";
        console.log("显示");
      } else {
        trailerBl = true;
        console.log("隐藏");
        videoElement.style.display = "none";
        videoElement.play();
      }
    }

    //模型点击事件
    SingleClickEvent(e) {
      var viewer = VMSDS.GIS;
      var handlers = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handlers.setInputAction(function (click) {
        try {
          if (!Cesium.defined(viewer.scene.pickPosition(click.position))) {
            return;
          }
          var cartographic = Cesium.Cartographic.fromCartesian(viewer.scene.pickPosition(click.position));
          var lng = Cesium.Math.toDegrees(cartographic.longitude);
          var tab = viewer.scene.pick(click.position); //选取当前的entity
          var lat = Cesium.Math.toDegrees(cartographic.latitude);
          var height = cartographic.height; //模型高度
          var mapPosition = { x: lng, y: lat, z: height };

          var idcode = "";
          if (tab != null) {
            if (tab.primitive != null) {
              idcode = tab.primitive.id;
              if (tab.primitive.id != null && tab.primitive.id.id != null) {
                idcode = tab.primitive.id.id;
              }
            } else if (tab.id != null) {
              idcode = tab.id;
            }
          }
          // console.log(tab)
          var modelType;
          var shapeType;
          if (tab != null && tab.primitive != null && tab.primitive.modelMatrix != null) {
            modelType = "scene";
          } else if (tab instanceof Cesium.Cesium3DTileset) {
            modelType = "tileset";
          } else if (tab instanceof Cesium.ImageryLayer) {
            modelType = "imageryLayer";
          } else {
            modelType = "entity";
          }
          if (tab == null) {
            modelType = "";
          }
          var popup_type;
          for (var i = 0; i < viewer.scene.primitives.length; i++) {
            var name = viewer.scene.primitives.get(i).name;
            if (name == "七堡") {
              var mod = viewer.scene.primitives.get(i);
              if (idcode == mod.id) {
                var str = decodeURI(mod._url);
                popup_type = mod.element.name;

                if (str.indexOf("DX") != -1) {
                  shapeType = "地面";
                } else if (str.indexOf("SB") != -1) {
                  shapeType = "设备";
                } else if (str.indexOf("JZSW") != -1) {
                  shapeType = "室外建筑";
                } else if (str.indexOf("JZ") != -1) {
                  shapeType = "建筑";
                } else if (str.indexOf("LH") != -1) {
                  shapeType = "绿化";
                } else if (str.indexOf("XP") != -1) {
                  shapeType = "其他";
                } else {
                  shapeType = str;
                }
                if (str.indexOf("设备") != -1) {
                  shapeType = "设备";
                }
              }
            }
          }
          var uuid = "";
          //#region 请勿观摩

          if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/水泵盖顶/右/4/tileset.json" == str) {
            uuid = "619534551667965952";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/水泵盖顶/右/3/tileset.json" == str) {
            uuid = "1435054816809234433";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/水泵盖顶/右/2/tileset.json" == str) {
            uuid = "1435055173153107970";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/水泵盖顶/右/1/tileset.json" == str) {
            uuid = "1435055590285029377";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/水泵盖顶/左/5/tileset.json" == str) {
            uuid = "1435056521521180673";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/水泵盖顶/左/6/tileset.json" == str) {
            uuid = "1435057652284567554";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/水泵盖顶/左/7/tileset.json" == str) {
            uuid = "1435058088999694337";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/泵体1/19/tileset.json" == str) {
            uuid = "1427479958642515970";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/泵体2/16/tileset.json" == str) {
            uuid = "1435059261135695873";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/泵体3/13/tileset.json" == str) {
            uuid = "1435059949139963905";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/泵体4/9/tileset.json" == str) {
            uuid = "1435060296692576258";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/泵体5/7/tileset.json" == str) {
            uuid = "1435060827473358849";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/泵体6/4/tileset.json" == str) {
            uuid = "1435061238053777410";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/泵体7/15/tileset.json" == str) {
            uuid = "1435061550537814017";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/3/tileset.json" == str) {
            uuid = "1435062679606702081";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/27/tileset.json" == str) {
            uuid = "1428156867151982593";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/2/6/tileset.json" == str) {
            uuid = "1435148518881800194";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/2/7/tileset.json" == str) {
            uuid = "1435149385760550913";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/2/8/tileset.json" == str) {
            uuid = "1435149753278050305";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/2/9/tileset.json" == str) {
            uuid = "1435150089208246274";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/2/12/tileset.json" == str) {
            uuid = "1435150511021010946";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/2/13/tileset.json" == str) {
            uuid = "1435150764646379522";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/2/14/tileset.json" == str) {
            uuid = "1435151005139382273";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/4/tileset.json" == str) {
            uuid = "1435160241781125121";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/5/tileset.json" == str) {
            uuid = "1435146812970283010";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/6/tileset.json" == str) {
            uuid = "1435146512834277377";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/8/tileset.json" == str) {
            uuid = "1435146244776308737";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/30/tileset.json" == str) {
            uuid = "1436241650620846082";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/20/tileset.json" == str) {
            uuid = "1435137682490568705";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/15/tileset.json" == str) {
            uuid = "1436249160023048194";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/33/tileset.json" == str) {
            uuid = "1435143605468573698";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/32/tileset.json" == str) {
            uuid = "1435145126826520578";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/31/tileset.json" == str) {
            uuid = "1435144190594953218";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/29/tileset.json" == str) {
            uuid = "1436242019547631618";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/19/tileset.json" == str) {
            uuid = "1435138026926813185";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/25/tileset.json" == str) {
            uuid = "1436244069891198978";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/24/tileset.json" == str) {
            uuid = "1436242275794440194";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/17/tileset.json" == str) {
            uuid = "1435138273610608641";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/28/tileset.json" == str) {
            uuid = "1436242783905009665";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/18/tileset.json" == str) {
            uuid = "1435138550698913793";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/34/tileset.json" == str) {
            uuid = "1435163084671987713";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/7/tileset.json" == str) {
            uuid = "1436244966817955842";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/12/tileset.json" == str) {
            uuid = "1435134970092892162";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/22/tileset.json" == str) {
            uuid = "1435136131504058370";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/9/tileset.json" == str) {
            uuid = "1436246417724178434";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/11/tileset.json" == str) {
            uuid = "1435135259059466241";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/21/tileset.json" == str) {
            uuid = "1435136473293697026";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/2/tileset.json" == str) {
            uuid = "1436246731315511297";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/13/tileset.json" == str) {
            uuid = "1435135520914059265";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/23/tileset.json" == str) {
            uuid = "1435136767373127681";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/1/tileset.json" == str) {
            uuid = "1435086703497883649";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/36/tileset.json" == str) {
            uuid = "1428157646625632257";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/35/tileset.json" == str) {
            uuid = "1435090898376503298";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/2/15/tileset.json" == str) {
            uuid = "1436253107630669825";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/2/2/tileset.json" == str) {
            uuid = "1436255869214949378";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/16/tileset.json" == str) {
            uuid = "1436248542432755714";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/26/tileset.json" == str) {
            uuid = "1436243802906972162";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/10/tileset.json" == str) {
            uuid = "1436240666452578306";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/1/14/tileset.json" == str) {
            uuid = "1436248844342951938";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/2/16/tileset.json" == str) {
            uuid = "1436256405360246785";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/2/17/tileset.json" == str) {
            uuid = "1436256597237071873";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/2/11/tileset.json" == str) {
            uuid = "1436254133616148481";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/2/4/tileset.json" == str) {
            uuid = "1436255370143105026";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/2/1/tileset.json" == str) {
            uuid = "1436253521369399297";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/2/3/tileset.json" == str) {
            uuid = "1436256875919212545";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/2/10/tileset.json" == str) {
            uuid = "1436254438437191682";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/1号楼/设备/2/5/tileset.json" == str) {
            uuid = "1436254901735817218";
          }
          if ("测试数据集" == str) {
            uuid = "1428159213999288321";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/拦污栅/4/tileset.json" == str) {
            uuid = "1435125432065241089";
          }
          if ("无单体化" == str) {
            uuid = "1436237362930700290";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/拦污栅/1/tileset.json" == str) {
            uuid = "1435125716640378882";
          }
          if ("无单体化" == str) {
            uuid = "1436238295605465089";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/拦污栅/2/tileset.json" == str) {
            uuid = "1435126152793468930";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/拦污栅/3/tileset.json" == str) {
            uuid = "1435126508797603842";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/拦污栅/5/tileset.json" == str) {
            uuid = "1435126942706741249";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/拦污栅/6/tileset.json" == str) {
            uuid = "1435127277844213761";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/拦污栅/7/tileset.json" == str) {
            uuid = "1435127627972128769";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/启闭机/2/tileset.json" == str) {
            uuid = "1435130143325597698";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/水闸/2/tileset.json" == str) {
            uuid = "1435128522109661185";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/JZ/3号楼/设备/1/tileset.json" == str) {
            uuid = "1435129452477591553";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/水闸/1/tileset.json" == str) {
            uuid = "1428158279927787522";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/水闸/3/tileset.json" == str) {
            uuid = "1435130443943948289";
          }
          if ("http://" + webgl_server_uri + "/3dtiles/SB/启闭机/1/tileset.json" == str) {
            uuid = "1435128938058788865";
          }
          //#endregion

          var wsc = {
            name: "SingleClickEvent",
            popup_id: uuid,
            shapeType: shapeType,
            popup_type: popup_type,
            warpWeft: mapPosition,
            id: idcode == undefined ? "" : idcode,
            modeladdtype: modelType,
          };
          if (e == undefined) {
            window.parent.postMessage(wsc, "*");
          } else {
            e(wsc);
          }
        } catch (error) {
          console.log(error);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    //透明可视化
    TransparentVisualization(value) {
      var viewer = VMSDS.GIS;
      for (var i = 0; i < viewer.scene.primitives.length; i++) {
        var name = viewer.scene.primitives.get(i).name;
        if (name == "七堡") {
          var defaultStyle = new Cesium.Cesium3DTileStyle({
            color: "color('white', 0.08)",
          });
          viewer.scene.primitives.get(i).style = defaultStyle;
        }
      }

      for (var i = 0; i < viewer.scene.primitives.length; i++) {
        var name = viewer.scene.primitives.get(i).name;
        if (name == "七堡") {
          var mod = viewer.scene.primitives.get(i);

          var str = decodeURI(mod._url);

          var defaultStyle = new Cesium.Cesium3DTileStyle({
            color: "color('white', 1)",
          });

          var shapeType;
          if (str.indexOf("DX") != -1) {
            shapeType = "地面";
          } else if (str.indexOf("SB") != -1) {
            shapeType = "设备";
            mod.style = defaultStyle;
          } else if (str.indexOf("JZSW") != -1) {
            shapeType = "室外建筑";
          } else if (str.indexOf("JZ") != -1) {
            shapeType = "建筑";
          } else if (str.indexOf("LH") != -1) {
            shapeType = "绿化";
          } else if (str.indexOf("XP") != -1) {
            shapeType = "其他";
          } else {
            shapeType = str;
          }
          if (str.indexOf("设备") != -1) {
            mod.style = defaultStyle;
          }

          var pid;
          pid = mod.element.pId;
          // 93
          if (pid == "93") {
            var defaultStyle = new Cesium.Cesium3DTileStyle({
              color: "color('white', 1)",
            });
            mod.style = defaultStyle;
          }
          if (pid == "94") {
            var defaultStyle = new Cesium.Cesium3DTileStyle({
              color: "color('white', 1)",
            });
            mod.style = defaultStyle;
          }
        }
      }

      if (value.visible == false) {
        for (var i = 0; i < viewer.scene.primitives.length; i++) {
          var name = viewer.scene.primitives.get(i).name;
          if (name == "七堡") {
            var defaultStyle = new Cesium.Cesium3DTileStyle({
              color: "color('white', 1)",
            });
            viewer.scene.primitives.get(i).style = defaultStyle;
          }
        }
      }
    }
    //移动高亮模型
    MobileDetection(_viewer) {
      var viewer = _viewer == null ? VMSDS.GIS : _viewer;

      for (var i = 0; i < viewer.scene.primitives.length; i++) {
        var modle = viewer.scene.primitives.get(i);
        if (modle.name == "七堡") {
          modle.show_ = false;
        }
      }

      var handlers = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handlers.setInputAction(function (movement) {
        var modle = viewer.scene.pick(movement.position); //选取当前的entity;
        if (modle && Cesium.defined(modle.tileset)) {
          modle = modle.tileset;
          // var modle = VMSDS.core.QueryModel_Scene(VMSDS.GIS,mod.id)
          if (Cesium.defined(modle)) {
            var shapeType;
            var str = decodeURI(modle._url);

            if (str.indexOf("DX") != -1) {
              shapeType = "地面";
            } else if (str.indexOf("SB") != -1) {
              shapeType = "设备";
            } else if (str.indexOf("JZSW") != -1) {
              shapeType = "室外建筑";
            } else if (str.indexOf("JZ") != -1) {
              shapeType = "建筑";
            } else if (str.indexOf("LH") != -1) {
              shapeType = "绿化";
            } else if (str.indexOf("XP") != -1) {
              shapeType = "其他";
            } else {
              shapeType = str;
            }
            if (str.indexOf("设备") != -1) {
              shapeType = "设备";
            }

            if (shapeType === "建筑") {
              if (modle.show_) {
                modle.show_ = false;
              } else {
                modle.show_ = true;
              }

              var id;
              var pid;
              pid = modle.element.pId;
              id = modle.element.id;
              if (pid == "6") {
                //处理 中控楼

                if (modle.element.name === "一层") {
                  // 93
                  VMSDS.GIS.building.forEach(e => {
                    var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                    if (em != null) {
                      if (e.pId === "93") {
                        if (modle.show_) {
                          var defaultStyle = new Cesium.Cesium3DTileStyle({
                            color: "color('white', 1)",
                          });
                          em.style = defaultStyle;
                        } else {
                          var defaultStyle = new Cesium.Cesium3DTileStyle({
                            color: "color('white', 1)",
                          });
                          em.style = defaultStyle;
                        }
                      }
                      if (e.pId === "94") {
                        if (modle.show_) {
                          var defaultStyle = new Cesium.Cesium3DTileStyle({
                            color: "color('white', 0.08)",
                          });
                          em.style = defaultStyle;
                        } else {
                          var defaultStyle = new Cesium.Cesium3DTileStyle({
                            color: "color('white', 1)",
                          });
                          em.style = defaultStyle;
                        }
                      }
                    }
                  });
                }
                if (modle.element.name === "二层") {
                  // 94
                  VMSDS.GIS.building.forEach(e => {
                    var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                    if (em != null) {
                      if (e.pId === "94") {
                        if (modle.show_) {
                          var defaultStyle = new Cesium.Cesium3DTileStyle({
                            color: "color('white', 1)",
                          });
                          em.style = defaultStyle;
                        } else {
                          var defaultStyle = new Cesium.Cesium3DTileStyle({
                            color: "color('white', 1)",
                          });
                          em.style = defaultStyle;
                        }
                      }
                      if (e.pId === "93") {
                        if (modle.show_) {
                          var defaultStyle = new Cesium.Cesium3DTileStyle({
                            color: "color('white', 0.08)",
                          });
                          em.style = defaultStyle;
                        } else {
                          var defaultStyle = new Cesium.Cesium3DTileStyle({
                            color: "color('white', 1)",
                          });
                          em.style = defaultStyle;
                        }
                      }
                    }
                  });
                }
                VMSDS.GIS.building.forEach(e => {
                  var modle = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                  if (modle != null) {
                    if (e.pId === pid && e.id !== id) {
                      modle.show_ = !modle.show_;
                    }
                  }
                });
              }
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      function mouseMove(ev) {
        ev = ev || window.event;
        var mousePos = mousePosition(ev);
        var pick = new Cesium.Cartesian2(mousePos.x, mousePos.y);

        var mod = viewer.scene.pick(pick); //选取当前的entity
        if (mod && Cesium.defined(mod.primitive)) {
          mod = mod.primitive;
          var shapeType;
          var str = decodeURI(mod._url);

          if (str.indexOf("DX") != -1) {
            shapeType = "地面";
          } else if (str.indexOf("SB") != -1) {
            shapeType = "设备";
          } else if (str.indexOf("JZSW") != -1) {
            shapeType = "室外建筑";
          } else if (str.indexOf("JZ") != -1) {
            shapeType = "建筑";
          } else if (str.indexOf("LH") != -1) {
            shapeType = "绿化";
          } else if (str.indexOf("XP") != -1) {
            shapeType = "其他";
          } else {
            shapeType = str;
          }
          if (str.indexOf("设备") != -1) {
            shapeType = "设备";
          }
          for (var i = 0; i < viewer.scene.primitives.length; i++) {
            var name = viewer.scene.primitives.get(i).name;
            if (name == "七堡") {
              var model = viewer.scene.primitives.get(i);
              if (model.style_ != null) {
                if (!model.show_) {
                  model.style = model.style_;
                }
              } else {
                // var defaultStyle = new Cesium.Cesium3DTileStyle({
                //     color: "color('white', 1)"
                // });
                // viewer.scene.primitives.get(i).style = defaultStyle;
              }
            }
          }

          if (shapeType == "设备") {
            mod.style_ = mod.style;

            var defaultStyle = new Cesium.Cesium3DTileStyle({
              color: "color('white', 0.5)",
            });
            mod.style = defaultStyle;
          }

          if (shapeType == "建筑") {
            var id;
            var pid;
            pid = mod.element.pId;
            id = mod.element.id;

            if (pid == "6") {
              VMSDS.GIS.building.forEach(e => {
                if (e.pId === pid && e.id !== id) {
                  var modle = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);

                  if (!modle.show_) {
                    modle.style_ = mod.style;
                    var defaultStyle = new Cesium.Cesium3DTileStyle({
                      color: "color('white', 0.08)",
                    });
                    modle.style = defaultStyle;
                  }
                }
              });
            } else {
              if (!mod.show_) {
                mod.style_ = mod.style;
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 0.08)",
                });
                mod.style = defaultStyle;
              }
            }
          }
        }
      }
      document.onmousemove = mouseMove;
    }

    //移动高亮模型2（切层）
    MobileDetectionV2(e) {
      var viewer = VMSDS.GIS;

      for (var i = 0; i < viewer.scene.primitives.length; i++) {
        var modle = viewer.scene.primitives.get(i);
        if (modle.name == "七堡") {
          modle.show_ = false;
        }
      }

      var handlers = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handlers.setInputAction(function (movement) {
        if (VMSDS.GIS.RoamingStatus == true) {
          return;
        } //漫游防冲突

        var modle = viewer.scene.pick(movement.position); //选取当前的entity;
        if (modle && Cesium.defined(modle.tileset)) {
          modle = modle.tileset;

          var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
            layer: "layer_1",
          });
          mods.forEach(element => {
            element.show = true;
          });
          var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
            layer: "layer_2",
          });
          mods.forEach(element => {
            element.show = true;
          });

          // var modle = VMSDS.core.QueryModel_Scene(VMSDS.GIS,mod.id)
          if (Cesium.defined(modle)) {
            var shapeType;
            var str = decodeURI(modle._url);

            if (str.indexOf("DX") != -1) {
              shapeType = "地面";
            } else if (str.indexOf("SB") != -1) {
              shapeType = "设备";
            } else if (str.indexOf("JZSW") != -1) {
              shapeType = "室外建筑";
            } else if (str.indexOf("JZ") != -1) {
              shapeType = "建筑";
            } else if (str.indexOf("LH") != -1) {
              shapeType = "绿化";
            } else if (str.indexOf("XP") != -1) {
              shapeType = "其他";
            } else {
              shapeType = str;
            }
            if (str.indexOf("设备") != -1) {
              shapeType = "设备";
            }

            if (shapeType === "设备") {
              var wsc = {
                name: "SingleClickEvent",
                shapeType: shapeType,
                id: modle.element.id,
              };
              if (e == undefined) {
                window.parent.postMessage(wsc, "*");
              } else {
                e(wsc);
              }
            }
            // console.log(modle.element,'modle.element.pId')
            if (modle.element.name === "2" && modle.element.pId === "10") {
              modle.show_ = !modle.show_;
              if (modle.show_) {
                //当前层
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 0)",
                });
                setTimeout(() => {
                  modle.style = defaultStyle;
                }, 100);
              }
              return;
            }

            if (shapeType === "建筑") {
              // console.log(modle.element)
              modle.show_ = !modle.show_;
              if ((modle.element.name === "2" && modle.element.pId === "7") || (modle.element.name === "2" && modle.element.pId === "8") || (modle.element.name === "2" && modle.element.pId === "9")) {
                VMSDS.GIS.building.forEach(e => {
                  if (e.name === "1" && e.pId === modle.element.pId) {
                    var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                    var defaultStyle = new Cesium.Cesium3DTileStyle({
                      color: "color('white', 0)",
                    });
                    em.show_ = !em.show_; //还原鼠标移动效果

                    setTimeout(() => {
                      em.style = defaultStyle;
                    }, 100);
                  }
                });
              } else if ((modle.element.name === "1" && modle.element.pId === "10") || (modle.element.name === "1" && modle.element.pId === "7") || (modle.element.name === "1" && modle.element.pId === "8") || (modle.element.name === "1" && modle.element.pId === "9")) {
                VMSDS.GIS.building.forEach(e => {
                  if (e.name === "2" && e.pId === modle.element.pId) {
                    var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                    var defaultStyle = new Cesium.Cesium3DTileStyle({
                      color: "color('white', 0)",
                    });
                    em.show_ = !em.show_; //还原鼠标移动效果

                    setTimeout(() => {
                      em.style = defaultStyle;
                    }, 100);
                  }
                });
              }

              var id;
              var pid;
              pid = modle.element.pId;
              id = modle.element.id;
              if (pid == "6") {
                //处理 中控楼

                if (modle.element.name === "一层") {
                  VMSDS.GIS.building.forEach(e => {
                    if (e.name == "屋顶") {
                      var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                      em.show_ = false; //还原鼠标移动效果
                    }
                  });

                  var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
                    layer: "layer_2",
                  });
                  mods.forEach(element => {
                    element.show = false;
                  });
                  var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
                    layer: "layer_1",
                  });
                  mods.forEach(element => {
                    element.show = true;
                  });
                  // 93
                  VMSDS.GIS.building.forEach(e => {
                    var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                    if (em != null) {
                      if (e.pId === "93") {
                        em.show_ = false;
                        if (modle.show_) {
                          //当前层

                          var defaultStyle = new Cesium.Cesium3DTileStyle({
                            color: "color('white', 1)", //设备
                          });
                          em.style = defaultStyle;
                        } else {
                          var defaultStyle = new Cesium.Cesium3DTileStyle({
                            color: "color('white', 1)", //设备
                          });
                          em.style = defaultStyle;
                        }
                      }
                      if (e.pId === "94" || e.name === "二层" || e.name === "屋顶") {
                        if (modle.show_) {
                          var defaultStyle = new Cesium.Cesium3DTileStyle({
                            color: "color('white', 0)",
                          });
                          em.style = defaultStyle;
                          if (e.pId === "94") {
                            em.show_ = true;
                          }
                        } else {
                          var defaultStyle = new Cesium.Cesium3DTileStyle({
                            color: "color('white', 1)",
                          });
                          em.style = defaultStyle;
                        }
                      }
                    }
                  });
                }
                if (modle.element.name === "二层") {
                  VMSDS.GIS.building.forEach(e => {
                    if (e.name == "屋顶") {
                      var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                      em.show_ = false; //还原鼠标移动效果
                    }
                  });

                  var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
                    layer: "layer_1",
                  });
                  mods.forEach(element => {
                    element.show = false;
                  });
                  var mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
                    layer: "layer_2",
                  });
                  mods.forEach(element => {
                    element.show = true;
                  });
                  // 94
                  VMSDS.GIS.building.forEach(e => {
                    var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                    if (em != null) {
                      if (e.pId === "94") {
                        em.show_ = false;
                        if (modle.show_) {
                          var defaultStyle = new Cesium.Cesium3DTileStyle({
                            color: "color('white', 1)",
                          });
                          em.style = defaultStyle;
                        } else {
                          var defaultStyle = new Cesium.Cesium3DTileStyle({
                            color: "color('white', 1)",
                          });
                          em.style = defaultStyle;
                        }
                      }
                      if (e.pId === "93" || e.name === "一层" || e.name === "屋顶") {
                        if (modle.show_) {
                          var defaultStyle = new Cesium.Cesium3DTileStyle({
                            color: "color('white', 0)",
                          });
                          em.style = defaultStyle;
                          if (e.pId === "93") {
                            em.show_ = true;
                          }
                        } else {
                          var defaultStyle = new Cesium.Cesium3DTileStyle({
                            color: "color('white', 1)",
                          });
                          em.style = defaultStyle;
                        }
                      }
                    }
                  });
                }

                if (modle.element.name === "屋顶") {
                  VMSDS.GIS.building.forEach(e => {
                    if (e.pId === "6" && e.name !== "屋顶") {
                      var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                      var defaultStyle = new Cesium.Cesium3DTileStyle({
                        color: "color('white', 0)",
                      });
                      setTimeout(() => {
                        em.style = defaultStyle;
                      }, 100);
                    }
                  });
                  modle.show_ = true; //还原鼠标移动效果
                }
                VMSDS.GIS.building.forEach(e => {
                  var modle = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                  if (modle != null) {
                    if (e.pId === pid && e.id !== id) {
                      modle.show_ = !modle.show_;
                    }
                  }
                });
              }
            }

            if (shapeType == "设备") {
              //设备点击事件
              if (modle.show_) {
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 1)",
                });
                modle.show_ = false;
              } else {
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('#adadad', 0.5)", //方案三 鼠标触发颜色
                });
                modle.show_ = true;
              }
              modle.style = defaultStyle;
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      function mouseMove(ev) {
        if (VMSDS.GIS.RoamingStatus == true) {
          return;
        } //漫游防冲突 对此无效

        ev = ev || window.event;
        var mousePos = window.mousePosition(ev);
        if (mousePos.x == 0 && mousePos.y == 0) {
          return;
        }
        var pick = new Cesium.Cartesian2(mousePos.x, mousePos.y);

        var mod = viewer.scene.pick(pick); //选取当前的entity
        if (mod && Cesium.defined(mod.primitive)) {
          mod = mod.primitive;
          var shapeType;
          var str = decodeURI(mod._url);

          if (str.indexOf("DX") != -1) {
            shapeType = "地面";
          } else if (str.indexOf("SB") != -1) {
            shapeType = "设备";
          } else if (str.indexOf("JZSW") != -1) {
            shapeType = "室外建筑";
          } else if (str.indexOf("JZ") != -1) {
            shapeType = "建筑";
          } else if (str.indexOf("LH") != -1) {
            shapeType = "绿化";
          } else if (str.indexOf("XP") != -1) {
            shapeType = "其他";
          } else {
            shapeType = str;
          }
          if (str.indexOf("设备") != -1) {
            shapeType = "设备";
          }

          if (shapeType == "设备") {
            //包含该元素,鼠标变成手势
            $("canvas").css("cursor", "pointer"); //鼠标箭头换成小手
          } else {
            $("canvas").css("cursor", "default"); //鼠标小手换成箭头
          }

          for (var i = 0; i < viewer.scene.primitives.length; i++) {
            var name = viewer.scene.primitives.get(i).name;
            if (name == "七堡") {
              var model = viewer.scene.primitives.get(i);
              if (model.style_ != null) {
                if (!model.show_) {
                  model.style = model.style_;
                }
              } else {
                var str = decodeURI(model._url);
                if (str.indexOf("SB") != -1 && !model.show_) {
                  model.style = new Cesium.Cesium3DTileStyle({
                    color: "color('white', 1)",
                  });
                }
                if (str.indexOf("设备") != -1 && !model.show_) {
                  model.style = new Cesium.Cesium3DTileStyle({
                    color: "color('white', 1)",
                  });
                }
              }
            }
          }
          if (!mod.element) return;
          //  console.log(mod.element.pId,mod.element.name)
          if (mod.element.name === "2" && mod.element.pId === "10") {
            if (!mod.show_) {
              mod.style_ = mod.style;
              var defaultStyle = new Cesium.Cesium3DTileStyle({
                color: "color('white', 0.08)",
              });
              mod.style = defaultStyle;
            }
            return;
          }
          if ((mod.element.name === "2" && mod.element.pId === "7") || (mod.element.name === "2" && mod.element.pId === "8") || (mod.element.name === "2" && mod.element.pId === "9")) {
            VMSDS.GIS.building.forEach(e => {
              if (e.pId === mod.element.pId && e.name !== mod.element.name) {
                var modle = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);

                if (!modle.show_) {
                  modle.style_ = mod.style;
                  var defaultStyle = new Cesium.Cesium3DTileStyle({
                    color: "color('white', 0.08)",
                  });
                  modle.style = defaultStyle;
                }
              }
            });
          }
          if ((mod.element.name === "1" && mod.element.pId === "10") || (mod.element.name === "1" && mod.element.pId === "7") || (mod.element.name === "1" && mod.element.pId === "8") || (mod.element.name === "1" && mod.element.pId === "9")) {
            VMSDS.GIS.building.forEach(e => {
              if (e.pId === mod.element.pId && e.name !== mod.element.name) {
                var modle = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);

                if (!modle.show_) {
                  modle.style_ = mod.style;
                  var defaultStyle = new Cesium.Cesium3DTileStyle({
                    color: "color('white', 0.08)",
                  });
                  modle.style = defaultStyle;
                }
              }
            });
            return;
          }

          if (shapeType == "设备" && !mod.show_) {
            // mod.style_ = mod.style;

            var defaultStyle = new Cesium.Cesium3DTileStyle({
              color: "color('#adadad', 0.5)", //方案三 鼠标触发颜色
            });
            mod.style = defaultStyle;
          }

          if (shapeType == "建筑") {
            var id;
            var pid;
            pid = mod.element.pId;
            id = mod.element.id;

            if (pid == "6") {
              VMSDS.GIS.building.forEach(e => {
                if (e.pId === pid && e.id !== id) {
                  var modle = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);

                  if (!modle.show_) {
                    modle.style_ = mod.style;
                    var defaultStyle = new Cesium.Cesium3DTileStyle({
                      color: "color('white', 1)", //0.08 房体鼠标透明
                    });
                    modle.style = defaultStyle;
                  }
                }
              });
            } else {
              if (mod.element.name === "1" && mod.element.pId === "10") {
                //取消地下室墙面触发事件
                return;
              }

              if (!mod.show_) {
                mod.style_ = mod.style;
                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 0.08)", //0.08 房体鼠标透明
                });
                mod.style = defaultStyle;
              }
            }
          }
        }
      }
      document.onmousemove = mouseMove;
    }
    //复位
    fuwei() {
      VMSDS.core.Location(VMSDS.GIS, {
        h: 5.66,
        p: -0.4613129754,
        r: 6.28,
        x: 120.267329,
        y: 30.293386,
        z: 71.56,
        duration: 0,
        force: true, //强制
      });
    }
    //Mouse click penetration 点击穿透
    ActiveClickPenetration(e) {
      if (e == undefined) {
        e = function (model) {
          // console.log(model)
          var wsc = {
            name: "SingleClickEvent",
            shapeType: "设备",
            id: model.id,
          };
          window.parent.postMessage(wsc, "*");
        };
      }
      var viewer = VMSDS.GIS;
      var handlers = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handlers.setInputAction(function (movement) {
        function model_show() {
          var modle = viewer.scene.pick(movement.position); //选取当前的entity;
          if (modle && Cesium.defined(modle.tileset)) {
            modle = modle.tileset;
            var shapeType;
            var str = decodeURI(modle._url);

            if (str.indexOf("JZ") != -1) {
              shapeType = "建筑";
            } else if (str.indexOf("SB") != -1) {
              shapeType = "设备";
            } else {
              shapeType = str;
            }
            if (str.indexOf("设备") != -1) {
              shapeType = "设备";
            }

            var EventState = true;

            function event(modle) {
              EventState = false;
              if (e) {
                e(modle);
              }
            }
            var id;
            var pid;
            pid = modle.element.pId;
            id = modle.element.id;
            if (pid == "6") {
              //处理 中控楼
              if (shapeType != "设备") {
                modle.show = false;
                model_show();
              } else {
                event(modle);
              }
            }

            if (pid == "7" || pid == "8" || pid == "9") {
              //临江建筑
              if (shapeType != "设备") {
                modle.show = false;
                model_show();
              } else {
                event(modle);
              }
            }

            if (pid == "10") {
              //处理 地下
              if (shapeType != "设备") {
                modle.show = false;
                model_show();
              } else {
                event(modle);
              }
            }

            if (EventState) {
              if (shapeType == "设备") {
                if (e) {
                  e(modle);
                }
              }
            }
          }
        }
        model_show();
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
      handlers.setInputAction(function (movement) {
        for (var i = 0; i < viewer.scene.primitives.length; i++) {
          var modle = viewer.scene.primitives.get(i);
          if (modle.name == "七堡") {
            var pid;
            pid = modle.element.pId;
            if (pid == "6") {
              //处理 中控楼
              modle.show = true;
            }
            if (pid == "10") {
              //处理 地下室
              modle.show = true;
            }
            if (pid == "7" || pid == "8" || pid == "9") {
              //临江建筑
              modle.show = true;
            }
          }
        }

        // handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_DOWN);
        // handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_UP);
      }, Cesium.ScreenSpaceEventType.LEFT_UP);
    }

    BuildPull_out(e) {
      this.MobileDetection();
      var handlers = new Cesium.ScreenSpaceEventHandler(VMSDS.GIS.scene.canvas);
      handlers.setInputAction(function (movement) {
        var modle = VMSDS.GIS.scene.pick(movement.position); //选取当前的entity;
        if (modle && Cesium.defined(modle.tileset)) {
          modle = modle.tileset;
          // var modle = VMSDS.core.QueryModel_Scene(VMSDS.GIS,mod.id)
          if (Cesium.defined(modle)) {
            var shapeType;
            var str = decodeURI(modle._url);

            if (str.indexOf("DX") != -1) {
              shapeType = "地面";
            } else if (str.indexOf("SB") != -1) {
              shapeType = "设备";
            } else if (str.indexOf("JZSW") != -1) {
              shapeType = "室外建筑";
            } else if (str.indexOf("JZ") != -1) {
              shapeType = "建筑";
            } else if (str.indexOf("LH") != -1) {
              shapeType = "绿化";
            } else if (str.indexOf("XP") != -1) {
              shapeType = "其他";
            } else {
              shapeType = str;
            }
            if (str.indexOf("设备") != -1) {
              shapeType = "设备";
            }

            if (shapeType === "设备") {
              var wsc = {
                name: "SingleClickEvent",
                shapeType: shapeType,
                id: modle.element.id,
              };
              if (e == undefined) {
                window.parent.postMessage(wsc, "*");
              } else {
                e(wsc);
              }
            }
            var id;
            var pid;
            pid = modle.element.pId;
            id = modle.element.id;
            if (pid == "6") {
              //处理 中控楼
              if (modle.element.name === "一层") {
                if (modle.show_) {
                  var viewer = app_viewer();
                  add_mod(viewer, modle.element, "外墙");

                  VMSDS.GIS.building.forEach(e => {
                    if (e.pId === "93") {
                      add_mod(viewer, e, "设备");
                    }
                  });
                }
              }
              if (modle.element.name === "二层") {
                if (modle.show_) {
                  var viewer = app_viewer();
                  add_mod(viewer, modle.element, "外墙");
                  VMSDS.GIS.building.forEach(e => {
                    if (e.pId === "94") {
                      add_mod(viewer, e, "设备");
                    }
                  });
                }
              }
            }
            if (modle.element.pId === "7" && modle.element.name === "1") {
              if (modle.show_) {
                var viewer = app_viewer();
                add_mod(viewer, modle.element, "外墙");
                var lj_pid;
                VMSDS.GIS.building.forEach(e => {
                  if (e.name == "临江匝道室") {
                    lj_pid = e.id;
                  }
                });

                VMSDS.GIS.building.forEach(e => {
                  if (e.pId == lj_pid && e.name === "1") {
                    var str = decodeURI(e.site);
                    if (str.indexOf("设备") != -1) {
                      add_mod(viewer, e, "设备");
                    }
                  }
                });
              }
            }
            if (modle.element.pId === "9" && modle.element.name === "1") {
              if (modle.show_) {
                var viewer = app_viewer();
                add_mod(viewer, modle.element, "外墙");
                var lj_pid;
                VMSDS.GIS.building.forEach(e => {
                  if (e.name == "临江杂物间") {
                    lj_pid = e.id;
                  }
                });

                VMSDS.GIS.building.forEach(e => {
                  if (e.pId == lj_pid && e.name === "1") {
                    var str = decodeURI(e.site);
                    if (str.indexOf("设备") != -1) {
                      add_mod(viewer, e, "设备");
                    }
                  }
                });
              }
            }
            if (modle.element.pId === "8" && modle.element.name === "1") {
              if (modle.show_) {
                var viewer = app_viewer();
                add_mod(viewer, modle.element, "外墙");
                var lj_pid;
                VMSDS.GIS.building.forEach(e => {
                  if (e.name == "临江配电室") {
                    lj_pid = e.id;
                  }
                });

                VMSDS.GIS.building.forEach(e => {
                  if (e.pId == lj_pid && e.name === "1") {
                    var str = decodeURI(e.site);
                    if (str.indexOf("设备") != -1) {
                      add_mod(viewer, e, "设备");
                    }
                  }
                });
              }
            }
            function add_mod(viewer, e, key) {
              var model = VMSDS.core.add3DTiles(
                viewer,
                {
                  name: "七堡",
                  id: e.id,
                  url: e.site.replace("127.0.0.1:9731", webgl_server_uri), //gis.crcr.top:9732
                  duration: 0,
                  flyTo: key == "外墙" ? true : false, //视野转跳
                  height: 10,
                },
                {
                  color: "color('white', 1)",
                  show: true,
                }
              );
              model.element = e;
              switch (key) {
                case "外墙":
                  var defaultStyle = new Cesium.Cesium3DTileStyle({
                    color: "color('white', 0.2)",
                  });
                  model.style = defaultStyle;
                  break;
                case "设备":
                  break;
                default:
                  break;
              }
            }
            if (shapeType === "建筑") {
              if (modle.element.name === "2" && modle.element.pId === "10") {
                //地下室
                modle.show_ = true;
                if (modle.show_) {
                  //当前层
                  var defaultStyle = new Cesium.Cesium3DTileStyle({
                    color: "color('white', 0)",
                  });
                  modle.style = defaultStyle;
                }
                VMSDS.GIS.building.forEach(e => {
                  if (e.name === "1" && e.pId === "10") {
                    var modle = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                    modle.show_ = true;
                  }
                });
              } else if (modle.element.pId === "10" && modle.element.name === "1") {
                VMSDS.GIS.building.forEach(e => {
                  if (e.name === "2" && e.pId === "10") {
                    var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
                    var defaultStyle = new Cesium.Cesium3DTileStyle({
                      color: "color('white', 1)",
                    });
                    em.show_ = false; //还原鼠标移动效果
                    em.style = defaultStyle;
                  }
                });
              }
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      function app_viewer() {
        var viewer = VMSDS.control.addOverview("Overview");
        $(".overview-div").append(`
                <div class="btn-group mb-2" style="position: absolute;bottom: 10%;left: 42%;z-index: 999;">
                    <button type="button" class="btn btn-light">复位</button>
                </div>
                `);

        viewer.scene.globe.show = false;
        $($($("#Overview").find(".btn-group")[0]).find("button")[0]).click(function () {
          var list = VMSDS.core.QueryModel_Scene_Name(viewer, "七堡");
          viewer.flyTo(list[list.length - 1], {
            offset: {
              heading: Cesium.Math.toRadians(0.0),
              pitch: Cesium.Math.toRadians(-25),
              range: 0,
            },
            duration: 0,
          });
        });
        var btn = $($($("#Overview").find(".btn-group")[0]).find("button")[0]);
        $(btn).html("正在转跳中..");
        $(btn).attr("disabled", true);
        setTimeout(() => {
          setTimeout(() => {
            $(btn).attr("disabled", false);
            $(btn).html("默认坐标");
          }, 1 * 1000 + 500);
        }, 2000);
        function MobileDetection(viewer) {
          viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(function (mousePos) {
            mousePos = mousePos.endPosition;
            var pick = new Cesium.Cartesian2(mousePos.x, mousePos.y);

            var mod = viewer.scene.pick(pick); //选取当前的entity
            if (mod && Cesium.defined(mod.primitive)) {
              mod = mod.primitive;
              var shapeType;
              var str = decodeURI(mod._url);
              if (str.indexOf("SB") != -1) {
                shapeType = "设备";
              } else {
                shapeType = str;
              }
              if (str.indexOf("设备") != -1) {
                shapeType = "设备";
              }

              for (var i = 0; i < viewer.scene.primitives.length; i++) {
                var name = viewer.scene.primitives.get(i).name;
                if (name == "七堡") {
                  var model = viewer.scene.primitives.get(i);
                  if (model.style_ != null) {
                    model.style = model.style_;
                  }
                }
              }

              if (shapeType == "设备") {
                mod.style_ = mod.style;

                var defaultStyle = new Cesium.Cesium3DTileStyle({
                  color: "color('white', 0.8)",
                });
                mod.style = defaultStyle;
              }
            }
          }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }

        var handlers = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handlers.setInputAction(function (movement) {
          var modle = viewer.scene.pick(movement.position); //选取当前的entity;
          if (modle && Cesium.defined(modle.tileset)) {
            modle = modle.tileset;
            // var modle = VMSDS.core.QueryModel_Scene(VMSDS.GIS,mod.id)
            if (Cesium.defined(modle)) {
              var shapeType;
              var str = decodeURI(modle._url);

              if (str.indexOf("SB") != -1) {
                shapeType = "设备";
              }
              if (str.indexOf("设备") != -1) {
                shapeType = "设备";
              }

              if (shapeType === "设备") {
                var wsc = {
                  name: "SingleClickEvent",
                  shapeType: shapeType,
                  id: modle.element.id,
                };
                if (e == undefined) {
                  window.parent.postMessage(wsc, "*");
                } else {
                  e(wsc);
                }
              }
            }
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        MobileDetection(viewer);
        return viewer;
      }
    }
    /**
     * 立体墙（电子围栏）
     */
    _SolidWall() {
      var viewer = VMSDS.GIS;
      var h = 12;
      var list = [
        120.26649512835941, 30.29374414661551, 120.26649543330794, 30.29373435364659, 120.26659121649418, 30.29374012851044, 120.26659127096467, 30.29374602370352, 120.26674861551083, 30.29374545764404, 120.2667859606175, 30.293761675747707, 120.26683612190014, 30.29380814348052, 120.2668503352574,
        30.293842973537433, 120.26683250299729, 30.29402856516884, 120.26715209205068, 30.29412066989203, 120.26722641581976, 30.29414020639974, 120.26719116912231, 30.294234808448767, 120.26708458800873, 30.29420493884601, 120.26693660006602, 30.29450472224949, 120.26704374450425, 30.2945440117803,
        120.26651203124506, 30.29566126965019, 120.26571565709546, 30.29532367023434, 120.26575155912856, 30.29517617509935, 120.2657653028634, 30.29512092051673, 120.26600855147657, 30.29485450190342, 120.26612108389021, 30.29472037033357, 120.26619103381731, 30.29456921227994, 120.26616894469564,
        30.29449685092746, 120.26624646827607, 30.29433948382413, 120.26653282382114, 30.29402426966147, 120.26656689185077, 30.29383664556706, 120.26648733804566, 30.29383239476862, 120.26649512835941, 30.29374414661551,
      ];
      var list2 = [
        120.26634948748953, 30.2934520586805, 120.26685378754259, 30.2934328788038, 120.2668468171052, 30.29357227060731, 120.26695590812268, 30.2935857529273, 120.26697830211968, 30.2938939835667, 120.2676362780722, 30.294105590003, 120.2673518783265, 30.2944530670117, 120.26729127795336,
        30.2944576317467, 120.26725457096825, 30.2945648088378, 120.26736999104028, 30.2946079583053, 120.26678099444662, 30.2958558170331, 120.26658332520006, 30.2959518080151, 120.2654969739516, 30.2954673329878, 120.2654457166051, 30.29536507472893, 120.26541463405684, 30.2951939465377,
        120.26590895896172, 30.2946029162696, 120.2661277780969, 30.29412444685539, 120.26625254780102, 30.2941534030346, 120.2662429748076, 30.29404042500041, 120.26614690673469, 30.2939941694895, 120.26619685011835, 30.2934960591569, 120.2663510515659, 30.29350872141157, 120.26634948748953,
        30.2934520586805,
      ];

      var SolidWallList1 = [];
      var SolidWallList2 = [];

      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        if (index % 2 == 0 && index != 0) {
          SolidWallList1.push(h);
        }
        SolidWallList1.push(element);
      }
      for (let index = 0; index < list2.length; index++) {
        const element = list2[index];
        if (index % 2 == 0 && index != 0) {
          SolidWallList2.push(h);
        }
        SolidWallList2.push(element);
      }
      SolidWallList1.push(h);
      SolidWallList2.push(h);

      //虚线
      var primitive = new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: new Cesium.PolylineGeometry({
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(SolidWallList1),
            width: 2.0,
            vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT,
          }),
        }),
        appearance: new Cesium.PolylineMaterialAppearance({
          material: Cesium.Material.fromType(Cesium.Material.PolylineDashType, {
            color: Cesium.Color.RED, //线条颜色
            gapColor: Cesium.Color.TRANSPARENT, //间隔颜色
            dashLength: 20, //短划线长度
          }),
        }),
      });
      viewer.scene.primitives.add(primitive);

      //虚线
      var primitive = new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: new Cesium.PolylineGeometry({
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(SolidWallList2),
            width: 2.0,
            vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT,
          }),
        }),
        appearance: new Cesium.PolylineMaterialAppearance({
          material: Cesium.Material.fromType(Cesium.Material.PolylineDashType, {
            color: Cesium.Color.BLUE, //线条颜色
            gapColor: Cesium.Color.TRANSPARENT, //间隔颜色
            dashLength: 20, //短划线长度
          }),
        }),
      });
      viewer.scene.primitives.add(primitive);

      viewer.entities.add({
        name: "lSelectWay",
        position: Cesium.Cartesian3.fromDegrees(120.26633405804266, 30.294244491108742, 12),
        label: {
          scale: 0.8,
          text: "管理范围线",
          font: "18px sans-serif",
          fillColor: Cesium.Color.fromCssColorString("#fd0000"),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 3,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scaleByDistance: new Cesium.NearFarScalar(1000, 1, 8000, 0), //缩放
        },
        _isQyPoint: true, //标识下，事件中判断
        tooltip: {
          //html: inthtml,
          anchor: [0, -12],
        },
      });

      viewer.entities.add({
        name: "lSelectWay",
        position: Cesium.Cartesian3.fromDegrees(120.26610507449006, 30.294172674282486, 12),
        label: {
          scale: 0.8,
          text: "保护范围线",
          font: "18px sans-serif",
          fillColor: Cesium.Color.fromCssColorString("#4395ff"),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scaleByDistance: new Cesium.NearFarScalar(1000, 1, 8000, 0), //缩放
        },
        _isQyPoint: true, //标识下，事件中判断
        tooltip: {
          //html: inthtml,
          anchor: [0, -12],
        },
      });

      //    viewer.entities.add({
      //         polyline: {
      //             positions: Cesium.Cartesian3.fromDegreesArray(list),
      //             width: 5,
      //             material:  new Cesium.PolylineGlowMaterialProperty({
      //                 glowPower : 0.2,
      //                 color : Cesium.Color.RED
      //             }),
      //             clampToGround: true
      //         }
      //     })
      //     viewer.entities.add({
      //         polyline: {
      //             positions: Cesium.Cartesian3.fromDegreesArray(list2),
      //             width: 5,
      //             material:  new Cesium.PolylineGlowMaterialProperty({
      //                 glowPower : 0.2,
      //                 color : Cesium.Color.BLUE
      //             }),
      //             clampToGround: true
      //         }
      //     })
    }
    //1
    example_ActiveClickPenetration() {
      QIBAO.TransparentVisualization({
        visible: true,
      }); //场景透明
      QIBAO.ActiveClickPenetration(function (model) {
        // console.log(model)
        var wsc = {
          name: "SingleClickEvent",
          shapeType: "设备",
          id: model.id,
        };
        window.parent.postMessage(wsc, "*");
      }); //点击穿透
    }
    //泵体结构点击
    PumpBodyBuildingClick() {
      var viewer = VMSDS.GIS;
      viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(function (click) {
        var tab = viewer.scene.pick(click.position); //选取当前的entity
        if (!Cesium.defined(viewer.scene.pickPosition(click.position)) || !viewer.scene.pick(click.position)) {
          return;
        }

        var str = decodeURI(tab.primitive._url);

        var uuid = "";
        //#region 请勿观摩
        if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/水泵盖顶/右/4/tileset.json" == str) {
          uuid = "排水系统-泵体1";
        }
        if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/水泵盖顶/右/3/tileset.json" == str) {
          uuid = "排水系统-泵体2";
        }
        if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/水泵盖顶/右/2/tileset.json" == str) {
          uuid = "排水系统-泵体3";
        }
        if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/水泵盖顶/右/1/tileset.json" == str) {
          uuid = "排水系统-泵体4";
        }
        if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/水泵盖顶/左/5/tileset.json" == str) {
          uuid = "排水系统-泵体5";
        }
        if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/水泵盖顶/左/6/tileset.json" == str) {
          uuid = "排水系统-泵体6";
        }
        if ("http://" + webgl_server_uri + "/3dtiles/SB/排水系统/水泵盖顶/左/7/tileset.json" == str) {
          uuid = "排水系统-泵体7";
        }

        //#endregion
        if (uuid !== "") {
          // console.log(tab.primitive)
          if (uuid !== viewer.PumpBodyUid && viewer.PumpBodyUid) {
            _tileset.display = false;
          }
          PumpBodyBuilding(uuid, tab.primitive); //"排水系统-泵体1"
          viewer.PumpBodyUid = uuid;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      var viewer = VMSDS.GIS;
      var models = [];
      var _tileset;
      var handlers = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handlers.setInputAction(function (movement) {
        var modle = viewer.scene.pick(movement.position); //选取当前的entity;
        if (modle && Cesium.defined(modle.tileset)) {
          var tileset = modle.tileset;
          if (!Cesium.defined(modle)) return;

          var str = decodeURI(tileset._url);

          if (str.indexOf("水泵建筑体") != -1) {
            PumpBodyBuilding(1, tileset);
          }
          if (str.indexOf("5号楼/建筑/2/") != -1) {
            // console.log(str)

            PumpBodyBuilding(2, tileset);
          }
          if (str.indexOf("5号楼/建筑/1/") != -1) {
            // console.log(str)

            PumpBodyBuilding(3, tileset);
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      var handlers = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handlers.setInputAction(function (movement) {
        var modle = viewer.scene.pick(movement.position); //选取当前的entity;
        if (modle && Cesium.defined(modle.tileset)) {
          var tileset = modle.tileset;
          if (!Cesium.defined(modle)) return;
          else {
            if (models) {
              models.forEach(e => {
                if (e.id == tileset.id) {
                  // console.log(tileset.id)
                  tileset.show = false;
                }
              });
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      var handlers = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handlers.setInputAction(function (movement) {
        models.forEach(element => {
          element.show = true;
        });
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      function PumpBodyBuilding(type, tileset) {
        console.log(type);

        models.forEach(element => {
          set_height(element, 10);
        });

        if (type != 1)
          if (_tileset) {
            set_height(_tileset, 10);
          }

        models = [];

        //遗憾的表示大泵一起弹出屏蔽 因为和单体弹出冲突
        if (type == 2) {
          if (_tileset) _tileset.display = false;
          return;

          VMSDS.GIS.building.forEach(e => {
            if (e.name === "排水系统-泵体5" || e.name === "排水系统-泵体6" || e.name === "排水系统-泵体7") {
              for (var i = 0; i < viewer.scene.primitives.length; i++) {
                if (viewer.scene.primitives.get(i).id == e.id) {
                  var model = viewer.scene.primitives.get(i);
                  models.push(model);
                }
              }
            }
          });

          var modelsEffectHeight = 9;
          var modelsEffect = setInterval(function () {
            if (modelsEffectHeight >= 20) {
              clearInterval(modelsEffect);
            }
            modelsEffectHeight = modelsEffectHeight + 0.2;
            models.forEach(element => {
              set_height(element, modelsEffectHeight);
            });
          }, 20);
        }
        if (type == 3) {
          if (_tileset) _tileset.display = false;
          return;
          VMSDS.GIS.building.forEach(e => {
            if (e.name === "排水系统-泵体5" || e.name === "排水系统-泵体6" || e.name === "排水系统-泵体7") {
              for (var i = 0; i < viewer.scene.primitives.length; i++) {
                if (viewer.scene.primitives.get(i).id == e.id) {
                  var model = viewer.scene.primitives.get(i);
                  models.push(model);
                }
              }
            }
          });
          var modelsEffectHeight = 20;
          var modelsEffect = setInterval(function () {
            modelsEffectHeight = modelsEffectHeight - 0.2;
            models.forEach(element => {
              set_height(element, modelsEffectHeight);
            });

            if (modelsEffectHeight <= 10) {
              clearInterval(modelsEffect);
            }
          }, 20);
        }

        // console.log(models);

        _tileset = tileset;
        function set_height(_tileset, height) {
          viewer._cesiumWidget._creditContainer.style.display = "none";
          viewer.scene.globe.depthTestAgainstTerrain = false;
          var boundingSphere = _tileset.boundingSphere;
          var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
          // var height = cartographic.height;//模型高度
          var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0);
          var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
          var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
          _tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
        }

        if (typeof type == "string") {
          VMSDS.GIS.building.forEach(e => {
            if (e.name === type) {
              for (var i = 0; i < viewer.scene.primitives.length; i++) {
                if (viewer.scene.primitives.get(i).id == e.id) {
                  var model = viewer.scene.primitives.get(i);
                  models.push(model);
                }
              }
            }
          });
        } else {
          VMSDS.GIS.building.forEach(e => {
            if (e.name === "排水系统-泵体1" || e.name === "排水系统-泵体2" || e.name === "排水系统-泵体3" || e.name === "排水系统-泵体4") {
              for (var i = 0; i < viewer.scene.primitives.length; i++) {
                if (viewer.scene.primitives.get(i).id == e.id) {
                  var model = viewer.scene.primitives.get(i);
                  models.push(model);
                }
              }
            }
          });
        }

        if (tileset.display) {
          var modelsEffectHeight = 20;
          var modelsEffect = setInterval(function () {
            modelsEffectHeight = modelsEffectHeight - 0.2;
            models.forEach(element => {
              set_height(element, modelsEffectHeight);
            });

            if (modelsEffectHeight <= 10) {
              clearInterval(modelsEffect);
            }
          }, 20);
          tileset.display = false;
        } else {
          var modelsEffectHeight = 9;
          var modelsEffect = setInterval(function () {
            if (modelsEffectHeight >= 20) {
              clearInterval(modelsEffect);
            }
            modelsEffectHeight = modelsEffectHeight + 0.2;
            models.forEach(element => {
              set_height(element, modelsEffectHeight);
            });
          }, 20);
          tileset.display = true;
        }
        if (tileset.display) {
          var heightOffsetAlarmEffect = 9;
          var OffsetAlarmEffect = setInterval(function () {
            if (heightOffsetAlarmEffect >= 25) {
              clearInterval(OffsetAlarmEffect);
            }
            heightOffsetAlarmEffect = heightOffsetAlarmEffect + 0.4;
            set_height(tileset, heightOffsetAlarmEffect);
          }, 20);
        } else {
          var heightOffsetAlarmEffect = 25;
          var OffsetAlarmEffect = setInterval(function () {
            heightOffsetAlarmEffect = heightOffsetAlarmEffect - 0.3;
            set_height(tileset, heightOffsetAlarmEffect);

            if (heightOffsetAlarmEffect <= 10.4) {
              clearInterval(OffsetAlarmEffect);
              set_height(tileset, 10);
            }
          }, 20);
        }

        // VMSDS.GIS.building.forEach((e) => {
        //   if (e.name === '2' && e.pId === '10') {
        //     var em = VMSDS.core.QueryModel_Scene(VMSDS.GIS, e.id);
        //     var defaultStyle = new Cesium.Cesium3DTileStyle({
        //       color: "color('white', 1)",
        //     });
        //     em.show_ = false; //还原鼠标移动效果
        //     em.style = defaultStyle;
        //   }
        // });

        // set_height(tileset,25)
      }
      this.PumpBodyBuilding = PumpBodyBuilding;
    }

    //添加建筑标签
    addlabels() {
      // 1.	管理房
      // 2.	附属管理房
      // 3.	配水泵室
      // 4.	排涝泵室
      // 5.	配水闸室
      // 6.	排涝闸室（自排闸室）

      var arr = [
        { x: 120.26605518923577, y: 30.29505500262163, z: 26 },
        { x: 120.26613384904797, y: 30.29534167864872, z: 26 },
        { x: 120.26636891643237, y: 30.29488048251546, z: 20 },
        { x: 120.2666920858969, y: 30.294958445841445, z: 20 },
        { x: 120.26653379702273, y: 30.29377718484355, z: 26 },
        { x: 120.26705279443712, y: 30.29414413137391, z: 26 },
      ];
      const _style = {
        //当前对象可选
        fontSize: 1, //字体大小
        fontColor: "#000", //字体颜色
        borderWitch: 2, //文字边框大小
        borderColor: "#fff", //边框颜色
      };
      VMSDS.core.addlabel(
        VMSDS.GIS,
        {
          id: "管理房",
          labeltxt: "管理房",
          x: arr[0].x,
          y: arr[0].y,
          z: arr[0].z,
        },
        _style
      );
      VMSDS.core.addlabel(
        VMSDS.GIS,
        {
          id: "附属管理房",
          labeltxt: "附属管理房",
          x: arr[1].x,
          y: arr[1].y,
          z: arr[1].z,
        },
        _style
      );
      VMSDS.core.addlabel(
        VMSDS.GIS,
        {
          id: "配水泵室",
          labeltxt: "配水泵室",
          x: arr[2].x,
          y: arr[2].y,
          z: arr[2].z,
        },
        _style
      );
      VMSDS.core.addlabel(
        VMSDS.GIS,
        {
          id: "排涝泵室",
          labeltxt: "排涝泵室",
          x: arr[3].x,
          y: arr[3].y,
          z: arr[3].z,
        },
        _style
      );
      VMSDS.core.addlabel(
        VMSDS.GIS,
        {
          id: "配水闸室",
          labeltxt: "配水闸室",
          x: arr[4].x,
          y: arr[4].y,
          z: arr[4].z,
        },
        _style
      );
      VMSDS.core.addlabel(
        VMSDS.GIS,
        {
          id: "排涝闸室（自排闸室）",
          labeltxt: "排涝闸室（自排闸室）",
          x: arr[5].x,
          y: arr[5].y,
          z: arr[5].z,
        },
        _style
      );
    }
    //设置标签可视
    visibilitylabels(value) {
      var mods = VMSDS.core.QueryModel_Entities_x(VMSDS.GIS, {
        type: "label",
      });
      for (let index = 0; index < mods.length; index++) {
        const element = mods[index];
        element.show = value;
      }
      console.log(mods);
    }
    getURL(url) {
      $.ajax({
        type: "GET",
        cache: false,
        async: false,
        url: url,
        data: "",
        success: function () {
          return true;
        },
        error: function () {
          return false;
        },
      });
    }
    //添加隐患点
    addProblemPoints(type) {
      var arr = [
        { x: 120.2670589688913, y: 30.294099819230315, z: 12 },
        { x: 120.26662622194581, y: 30.295276945913503, z: 10 },
        { x: 120.26669325587392, y: 30.294951952913063, z: 13 },
        { x: 120.2671378525824, y: 30.29389885562214, z: 10 },
        { x: 120.2663480613289, y: 30.294995734063793, z: 10 },
        { x: 120.26653758296257, y: 30.293747654388586, z: 15 },
        { x: 120.26577814921603, y: 30.294732434580872, z: 10 },
      ];

      var i = 0;

      arr.forEach(element => {
        var viewer = VMSDS.GIS;
        init_canvas(viewer, {
          x: element.x,
          y: element.y,
          z: element.z,
        });
      });
      function init_canvas(viewer, value) {
        function drawText(e) {
          let canvas = document.createElement("canvas");
          canvas.height = 400;
          canvas.width = 400;

          let ctx = canvas.getContext("2d");
          let image = new Image();

          image.src = "/core/images/隐患" + (i + 1) + ".png";
          if (!webgl_debug) image.src = "/3D/core/images/隐患" + (i + 1) + ".png";

          image.addEventListener("load", () => {
            ctx.drawImage(image, 55, 50, 800, 800, 0, 0, 800, 800);
            e(canvas);
          });

          i++;
        }

        if (type) {
          drawText(function (canvas) {
            viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(value.x, value.y, value.z),
              type: i - 1,
              name: "ProblemPoints",
              billboard: {
                image: canvas,
                scaleByDistance: new Cesium.NearFarScalar(50, 1, 300, 0.1),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                width: 160,
                height: 160,
              },
            });
          });
        } else {
          var dimensions = new Cesium.Cartesian3(10, 10, 10);
          var positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(value.x, value.y, value.z);
          // var translateMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid);
          var scaleMatrix = Cesium.Matrix4.fromScale(dimensions);

          var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), Cesium.Math.toRadians(0), Cesium.Math.toRadians(0));
          var translateMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(positionOnEllipsoid, hpr);

          var planeModelMatrix = new Cesium.Matrix4();

          Cesium.Matrix4.multiply(translateMatrix, scaleMatrix, planeModelMatrix);

          var planeGeometry = new Cesium.PlaneGeometry({
            vertexFormat: Cesium.MaterialAppearance.VERTEX_FORMAT,
          });
          var planeGeometryInstance = new Cesium.GeometryInstance({
            geometry: planeGeometry,
            modelMatrix: planeModelMatrix,
          });

          drawText(function (canvas) {
            var material = Cesium.Material.fromType("Image");
            material.uniforms.image = canvas;

            var model = viewer.scene.primitives.add(
              new Cesium.Primitive({
                geometryInstances: planeGeometryInstance,
                appearance: new Cesium.MaterialAppearance({
                  closed: false,
                  //translucent: false,
                  material: material,
                }),
              })
            );
            model.name = "ProblemPoints";
            model.type = i;
          });
          i++;
        }
      }
    }
    //隐藏相机气泡
    example_camera_setVisible(options) {
      var 枪机 = VMSDS.core.QueryModel_Entities_x(VMSDS.GIS, {
        type: "摄像头-枪机",
      });

      var 球机 = VMSDS.core.QueryModel_Entities_x(VMSDS.GIS, {
        type: "摄像头-球机",
      });
      for (let index = 0; index < 球机.length; index++) {
        const element = 球机[index];
        if (options.id === element.object.id) {
          element.show = options.visible;
          return true;
        }
      }
      for (let index = 0; index < 枪机.length; index++) {
        const element = 枪机[index];
        if (options.id === element.object.id) {
          element.show = options.visible;
          return true;
        }
      }
      return false;
    }

    /**
     * 定位七个泵体
     */
    example_positioning_camera(id) {
      var 枪机 = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
        type: "摄像头-枪机",
      });

      var 球机 = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
        type: "摄像头-球机",
      });

      for (let i = 0; i < 球机.length; i++) {
        const element = 球机[i];
        var selectedColor = new Cesium.Color(1, 1, 1, 1);
        element.color = selectedColor;
        if (element.object.id == id) {
          var selectedColor = Cesium.Color["Blue".toUpperCase()].withAlpha(0.7); //new Cesium.Color(0, 1, 0, 1);
          element.color = selectedColor;

          var camera = new Function("return " + element.object.camera)();

          Object.assign(camera, {
            duration: 3,
            force: true, //强制
          });
          VMSDS.core.Location(VMSDS.GIS, camera);
          return true;
        }
      }
      for (let i = 0; i < 枪机.length; i++) {
        const element = 枪机[i];
        var selectedColor = new Cesium.Color(1, 1, 1, 1);
        element.color = selectedColor;
        if (element.object.id == id) {
          var selectedColor = Cesium.Color["Blue".toUpperCase()].withAlpha(0.7); //new Cesium.Color(0, 1, 0, 1);
          element.color = selectedColor;

          var camera = new Function("return " + element.object.camera)();
          Object.assign(camera, {
            duration: 3,
            force: true, //强制
          });
          VMSDS.core.Location(VMSDS.GIS, camera);
          return true;
        }
      }
      return false;
    }
    //添加摄像头
    addSecurityCamera() {
      var viewer = VMSDS.GIS;
      if (viewer.setSelected) return;
      viewer.setSelected = true;
      var arr = [
        { id: "3FD815955E4811ECA56200163E0132C0", camera: "{y: 30.293971, x: 120.266944, z: 25.89, h: 6.09, p: -0.6545561479,r: 0}", name: "外江围墙周界枪机", xyz: { x: 120.26691918084657, y: 30.294126148932428, z: 14 }, type: "摄像头-枪机" },
        { id: "3FDA05DE5E4811ECA56200163E0132C0", camera: "{y: 30.295453, x: 120.266359, z: 8.23, h: 5.44, p: -0.0454660071, r: 0}", name: "上游桥球机", xyz: { x: 120.26623582547457, y: 30.29553302082086, z: 9 }, type: "摄像头-球机" },
        { id: "3FDBCFFA5E4811ECA56200163E0132C0", camera: "{y: 30.293642, x: 120.266796, z: 26.38, h: 6.14, p: -0.5349894957,r: 0}", name: "观潮亭球机1", xyz: { x: 120.26676747291567, y: 30.293810978379664, z: 15.5 }, type: "摄像头-球机" },
        { id: "3FDD9A165E4811ECA56200163E0132C0", camera: "{y: 30.294102, x: 120.267266, z: 21.07, h: 5.17, p: -0.5261846026,r: 0}", name: "排涝闸枪机", xyz: { x: 120.26715833643064, y: 30.294147111476033, z: 14.5 }, type: "摄像头-枪机" },
        { id: "3FDF3E055E4811ECA56200163E0132C0", camera: "{y: 30.293824, x: 120.266396, z: 20.07, h: 0.27, p: -0.3614052486,r: 0}", name: "外江围墙枪机", xyz: { x: 120.26643836108585, y: 30.293971814580434, z: 14.5 }, type: "摄像头-枪机" },
        { id: "3FE12E4E5E4811ECA56200163E0132C0", camera: "{y: 30.29361, x: 120.266407, z: 38.46, h: 0.57, p: -0.8675042858, r: 0}", name: "观潮亭球机2", xyz: { x: 120.26650670572847, y: 30.293744236576636, z: 17.5 }, type: "摄像头-球机" },
        { id: "3FE31E975E4811ECA56200163E0132C0", camera: "{y: 30.295262, x: 120.266348, z: 31.2, h: 4.82, p: -0.4372911854, r: 0}", name: "鹰眼子机", xyz: { x: 120.26612001582494, y: 30.29529883612534, z: 19.5 }, type: "摄像头-球机" },
        { id: "3FE4E8B35E4811ECA56200163E0132C0", camera: "{y: 30.293762, x: 120.266285, z: 26.39, h: 1.3, p: -0.4014737007, r: 0}", name: "观潮亭球机3", xyz: { x: 120.26650467330701, y: 30.29380046498245, z: 17.5 }, type: "摄像头-球机" },
        { id: "3FE6B2CF5E4811ECA56200163E0132C0", camera: "{y: 30.293597, x: 120.266443, z: 22.83, h: 0.33, p: -0.5972511612,r: 0}", name: "配水闸枪机", xyz: { x: 120.26650305264293, y: 30.29373479011233, z: 13 }, type: "摄像头-枪机" },
        { id: "3FE6C2CF5E4811ECA56200163E0132C0", camera: "{y: 30.295262, x: 120.266294, z: 20.1, h: 4.85, p: -0.0152468164, r: 0}", name: "鹰眼球机全景", xyz: { x: 120.26612001582494, y: 30.29529883612534, z: 20 }, type: "摄像头-球机" },
        { id: "3FE6D2CF5E4811ECA56200163E0132C0", camera: "{y: 30.293974, x: 120.266938, z: 19.8, h: 6.2, p: -0.3571406111,  r: 0}", name: "外江围墙热成像枪机", xyz: { x: 120.26691918084657, y: 30.294126148932428, z: 14 }, type: "摄像头-枪机" },
      ];

      // var i=0
      // setInterval(() => {
      //   QIBAO.example_positioning_camera(arr[i].id)
      //   if( i++ >= arr[i].length) i=0
      // }, 5000);
      var Gltfs = [];
      if (!viewer) return;
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];

        var uri = "/core/images/" + element.type + ".svg";
        if (!webgl_debug) var uri = "/3D/core/images/" + element.type + ".svg";
        viewer.entities.add({
          type: element.type,
          popup_name: element.name,
          popup_id: element.id,
          position: Cesium.Cartesian3.fromDegrees(element.xyz.x, element.xyz.y, element.xyz.z),
          show: true,
          object: element,
          billboard: {
            image: uri,
            scaleByDistance: new Cesium.NearFarScalar(600, 1, 1000, 0.1),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            width: 64,
            height: 64,
          },
        });

        var h = 0;
        switch (element.name) {
          case "外江围墙周界枪机":
          case "外江围墙热成像枪机":
            h = Cesium.Math.toRadians(70);
            break;
          case "外江围墙枪机":
            h = Cesium.Math.toRadians(-100);
            break;
          case "排涝闸枪机":
            h = Cesium.Math.toRadians(20);
            break;
          case "配水闸枪机":
            h = Cesium.Math.toRadians(0);
            break;
          default:
            break;
        }
        var hpRoll = new Cesium.HeadingPitchRoll(h, 0, 0); //new Cesium.HeadingPitchRoll();
        var position = Cesium.Cartesian3.fromDegrees(element.xyz.x, element.xyz.y, element.xyz.z);
        var fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator("north", "west");
        var uri = "/assets/model/";
        if (!webgl_debug) var uri = "/3D/assets/model/";

        var camera_model_url = uri + element.type + ".glb";

        var railing_model_url = uri + "栏杆.glb";
        //栏杆.glb

        if (
          element.name !== "鹰眼子机" &&
          element.name !== "鹰眼球机全景" &&
          element.name !== "上游桥球机" &&
          element.name !== "配水闸枪机"
          // && element.name !== "观潮亭球机1"
        ) {
          var xyz = Cesium.Cartesian3.fromDegrees(element.xyz.x, element.xyz.y, 10);
          var hpr = new Cesium.HeadingPitchRoll(0, 0, 0);
          if (element.name === "观潮亭球机2" || element.name === "观潮亭球机3") {
            if (element.name == "观潮亭球机2") {
              xyz = Cesium.Cartesian3.fromDegrees(120.26650285574493, 30.293744031454484, 13);
            } else {
              xyz = Cesium.Cartesian3.fromDegrees(120.26650047169053, 30.293801239323717, 13);
            }

            hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(180), 0, 0);
          }
          if (element.name === "观潮亭球机1") {
            //x: 120.26677215412022, y: 30.2938095977817
            xyz = Cesium.Cartesian3.fromDegrees(120.26677215412022, 30.2938095977817, 11);
          }

          viewer.scene.primitives.add(
            Cesium.Model.fromGltf({
              url: railing_model_url,
              scale: 1.2,
              modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(xyz, hpr, Cesium.Ellipsoid.WGS84, fixedFrameTransform),
            })
          );
        }

        //Cesium.Math.toRadians(direction)
        if (element.name === "外江围墙热成像枪机") {
          var position = Cesium.Cartesian3.fromDegrees(element.xyz.x, element.xyz.y, element.xyz.z + 0.5);
        }
        var Gltf = viewer.scene.primitives.add(
          Cesium.Model.fromGltf({
            url: camera_model_url,
            scale: element.type == "摄像头-球机" ? 5 : 0.08,
            modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(position, hpRoll, Cesium.Ellipsoid.WGS84, fixedFrameTransform),
          })
        );
        Gltf.object = element;
        Gltf.type = element.type;
        Gltf.popup_id = element.id;
        Gltf.popup_name = element.name;
        Gltfs.push(Gltf);
      }
      function getGPU() {
        const canvas = document.createElement("canvas"),
          gl = canvas.getContext("experimental-webgl"),
          debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        const info = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        return info;
      }

      // return//不进行泛光
      var textGPU = getGPU();
      console.log(textGPU);
      if ("" !== textGPU) {
        Gltf.readyPromise
          .then(function () {
            setSelected(postProcessStage, Gltfs);
          })
          .otherwise(function (error) {
            console.log(error);
          });
      }
      var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function (movement) {
        var model = viewer.scene.pick(movement.position); //选取当前的entity

        Gltfs.forEach(element => {
          var selectedColor = new Cesium.Color(1, 1, 1, 1);
          element.color = selectedColor;
        });
        var selected = false;
        if (model && Cesium.defined(model.primitive)) {
          selected = model.primitive;
          // colors: ['White', 'Red', 'Green', 'Blue', 'Yellow', 'Gray'],
          var selectedColor = Cesium.Color["Blue".toUpperCase()]; //new Cesium.Color(0, 1, 0, 1);
          selected.color = selectedColor;
        }

        if (model && Cesium.defined(model.id)) {
          selected = model.id;
        }
        if (selected instanceof Cesium.Cesium3DTileset || !selected) {
          return;
        }
        if (selected.type.indexOf("摄像头") != -1) {
          var wsc = {
            name: "SingleClickEvent",
            popup_id: selected.popup_id,
            popup_name: selected.popup_name,
            shapeType: "摄像头",
          };
          window.parent.postMessage(wsc, "*");
        }

        // VMSDS.core.Highlight(Gltf)
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      let setSelected = (postProcessStage, pickeds) => {
        postProcessStage.selected = [];
        postProcessStage.enabled = false;
        let pickObjects = [];

        for (let index = 0; index < pickeds.length; index++) {
          const picked = pickeds[index];

          if (picked) {
            let primitive = picked;
            let pickIds = primitive._pickIds;
            let pickId = picked.pickId;

            if (!pickId && !pickIds && picked.content) {
              pickIds = picked.content._model._pickIds;
            }

            if (!pickId) {
              if (picked.id) {
                pickId = pickIds.find(pickId => {
                  return pickId.object == picked;
                });
              } else if (pickIds) {
                pickId = pickIds[0];
              }
            }

            if (pickId) {
              let pickObject = {
                pickId: pickId,
              };
              pickObjects.push(pickObject);
            } else {
              console.log("未找到pickId");
            }
          }
        }
        postProcessStage.selected = pickObjects;
        postProcessStage.enabled = !postProcessStage.enabled;
      };
      let postProcessStage = VMSDS.effect.createUnrealBloomStage("unrealBloom");
      postProcessStage.enabled = false;
      viewer.postProcessStages.add(postProcessStage);
    }
    visibilityProblem(value) {
      var mods = VMSDS.core.QueryModel_Entities_x(VMSDS.GIS, {
        name: "ProblemPoints",
      });
      var _mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
        name: "ProblemPoints",
      });

      for (let index = 0; index < mods.length; index++) {
        const element = mods[index];

        if (value.index == element.type) {
          element.show = value.visibility;
        }
      }
      for (let index = 0; index < _mods.length; index++) {
        const element = _mods[index];
        if (value.index == element.type) {
          element.show = value.visibility;
        }
      }
    }

    visibilitycjgcd(value) {
      var mods = VMSDS.core.QueryModel_Entities_x(VMSDS.GIS, {
        name: "cjgcds",
      });
      var _mods = VMSDS.core.QueryModel_Scene_x(VMSDS.GIS, {
        name: "cjgcds",
      });

      for (let index = 0; index < mods.length; index++) {
        const element = mods[index];

        if (value.index == element.type) {
          element.show = value.visibility;
        }
      }
      for (let index = 0; index < _mods.length; index++) {
        const element = _mods[index];
        if (value.index == element.type) {
          element.show = value.visibility;
        }
      }
    }
    //添加沉降观测点
    addcjgcd(type) {
      var arr = [
        { x: 120.26625716573467, y: 30.29494705910295, z: 15 },
        { x: 120.26644080323425, y: 30.29499584219753, z: 15 },
        { x: 120.26659957270506, y: 30.29501235529089, z: 15 },
        { x: 120.26670565577997, y: 30.29510171870366, z: 15 },
        { x: 120.26676138653185, y: 30.29497618287548, z: 15 },
        { x: 120.26663509614802, y: 30.29493934643333, z: 15 },
        { x: 120.26667203647445, y: 30.29487645802892, z: 15 },
        { x: 120.26678801728804, y: 30.29491668369452, z: 15 },
        { x: 120.26645800172548, y: 30.29490219027531, z: 15 },
        { x: 120.26628612789985, y: 30.29485105603528, z: 15 },
        { x: 120.26715434434782, y: 30.29413824139022, z: 15 },
        { x: 120.26691298524635, y: 30.29406801913779, z: 15 },
      ];

      var i = 0;

      arr.forEach(element => {
        var viewer = VMSDS.GIS;
        init_canvas(viewer, {
          x: element.x,
          y: element.y,
          z: element.z,
        });
      });
      function init_canvas(viewer, value) {
        function drawText(e) {
          let canvas = document.createElement("canvas");
          canvas.height = 400;
          canvas.width = 400;

          let ctx = canvas.getContext("2d");
          let image = new Image();

          image.src = "/core/images/沉降观测点.png";
          if (!webgl_debug) image.src = "/3D/core/images/沉降观测点.png";

          image.addEventListener("load", () => {
            // ctx.drawImage(image, 55, 50, 400, 400, 0, 0, 800, 800);
            ctx.drawImage(image, 10, 10);
            e(canvas);
          });

          i++;
        }

        if (type) {
          drawText(function (canvas) {
            viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(value.x, value.y, value.z),
              type: i - 1,
              name: "cjgcds",
              billboard: {
                image: canvas,
                scaleByDistance: new Cesium.NearFarScalar(20, 1, 60, 0.1),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                width: 60,
                height: 60,
              },
            });
          });
        } else {
          var dimensions = new Cesium.Cartesian3(10, 10, 10);
          var positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(value.x, value.y, value.z);
          // var translateMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid);
          var scaleMatrix = Cesium.Matrix4.fromScale(dimensions);

          var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), Cesium.Math.toRadians(0), Cesium.Math.toRadians(0));
          var translateMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(positionOnEllipsoid, hpr);

          var planeModelMatrix = new Cesium.Matrix4();

          Cesium.Matrix4.multiply(translateMatrix, scaleMatrix, planeModelMatrix);

          var planeGeometry = new Cesium.PlaneGeometry({
            vertexFormat: Cesium.MaterialAppearance.VERTEX_FORMAT,
          });
          var planeGeometryInstance = new Cesium.GeometryInstance({
            geometry: planeGeometry,
            modelMatrix: planeModelMatrix,
          });

          drawText(function (canvas) {
            var material = Cesium.Material.fromType("Image");
            material.uniforms.image = canvas;

            var model = viewer.scene.primitives.add(
              new Cesium.Primitive({
                geometryInstances: planeGeometryInstance,
                appearance: new Cesium.MaterialAppearance({
                  closed: false,
                  //translucent: false,
                  material: material,
                }),
              })
            );
            model.name = "ProblemPoints";
            model.type = i;
          });
          i++;
        }
      }
    }
  }

  window.mousePosition = function (ev) {
    if (ev.pageX || ev.pageY) {
      //firefox、chrome等浏览器
      return { x: ev.pageX, y: ev.pageY };
    }
    return {
      // IE浏览器
      x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
      y: ev.clientY + document.body.scrollTop - document.body.clientTop,
    };
  };

  window.QIBAO = qb_hght_webgl_;
})(window);
