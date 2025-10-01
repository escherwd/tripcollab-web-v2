"use server";

export type HereMultimodalRouteSectionType =
  | "pedestrian"
  | "transit"
  | "vehicle"
  | "rented"
  | "taxi";

export type HereMultimodalRouteSectionTransportMode =
  | "highSpeedTrain"
  | "intercityTrain"
  | "interRegionalTrain"
  | "regionalTrain"
  | "cityTrain"
  | "bus"
  | "busRapid"
  | "ferry"
  | "subway"
  | "lightRail"
  | "privateBus"
  | "inclined"
  | "aerialBus"
  | "rapid"
  | "monorail"
  | "flight";

export type HereMultimodalRouteSectionTransport<
  T extends HereMultimodalRouteSectionType
> = T extends "transit"
  ? {
      mode: HereMultimodalRouteSectionTransportMode;
      name?: string;
      headsign?: string;
      category?: string; // Human readable category name like 'Bus' or 'Train'
      color?: string;
      textColor?: string;
      shortName?: string;
      longName?: string;
      url?: string;
    }
  : never | T extends "taxi" | "rented"
  ? {
      mode: "car" | "bicycle" | "kickScooter";
      name?: string;
      category?: string;
      color?: string;
      textColor?: string;
      model?: string;
      licensePlate?: string;
      seats?: number;
      engine?: "electric" | "combustion";
    }
  : never | T extends "pedestrian" | "vehicle"
  ? {
      mode: "pedestrian" | "car";
    }
  : never;

export type HereMultimodalRoutePlace = {
  id?: string;
  name?: string;
  type:
    | "place"
    | "station"
    | "accessPoint"
    | "parkingLot"
    | "chargingStation"
    | "dockingStation";
  location: {
    lat: number;
    lng: number;
  };
  platform?: string;
  code?: string;
};

export type HereMultimodalRouteSection = {
  id: string;
  type: HereMultimodalRouteSectionType;
  departure: {
    time: string;
    place: HereMultimodalRoutePlace;
  };
  arrival: {
    time: string;
    place: HereMultimodalRoutePlace;
  };
  polyline: string;
  transport: HereMultimodalRouteSectionTransport<HereMultimodalRouteSectionType>;
  agency?: {
    id: string;
    name: string;
    website?: string;
  };
  notices?: {
    code: string;
  }[];
  spans?: {
    walkAttributes: string[];
  }[];
  attributions?: {
    id: string;
    href: string;
    text: string;
    type: string;
  }[];
};

export type HereMultimodalRoute = {
  id: string;
  sections: HereMultimodalRouteSection[];
};

export const serverCalculateMultimodalRoute = async (
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  alternatives: number = 2
): Promise<HereMultimodalRoute[]> => {
  // temp: return this cached result
  const cachedResult = [
    {
      id: "R0",
      sections: [
        {
          id: "R0-S0",
          type: "pedestrian",
          departure: {
            time: "2025-09-30T09:41:00+02:00",
            place: {
              type: "place",
              location: {
                lat: 52.378909,
                lng: 4.900551,
              },
            },
          },
          arrival: {
            time: "2025-09-30T09:41:00+02:00",
            place: {
              name: "Amsterdam Centraal",
              type: "station",
              location: {
                lat: 52.37892,
                lng: 4.900889,
              },
              id: "21260_157177",
            },
          },
          polyline: "BG0v-8jDkyjrJqGwG",
          transport: {
            mode: "pedestrian",
          },
        },
        {
          id: "R0-S1",
          type: "transit",
          departure: {
            time: "2025-09-30T09:41:00+02:00",
            place: {
              name: "Amsterdam Centraal",
              type: "station",
              location: {
                lat: 52.37892,
                lng: 4.900889,
              },
              id: "21260_157177",
              platform: "1",
            },
          },
          arrival: {
            time: "2025-09-30T09:46:00+02:00",
            place: {
              name: "Amsterdam Sloterdijk",
              type: "station",
              location: {
                lat: 52.388562,
                lng: 4.83716,
              },
              id: "21260_61838",
              platform: "7",
            },
          },
          polyline:
            "BHgruhnf8onv9Ck1pB_51D4ravzqC8rPv5kB4ooBz_oC0jLroX40nB3s2Ds7Qvz7Bg0FntsB4jFzxlCjhB37pM7a785C35E73jDrEnxqB",
          transport: {
            mode: "regionalTrain",
            name: "Sprinter",
            category: "Rail",
            headsign: "Zandvoort aan Zee",
            shortName: "Sprinter",
            longName: "Amsterdam Centraal <-> Zandvoort aan Zee SPR5400",
          },
          agency: {
            id: "21260_32b565d",
            name: "NS",
            website: "http://www.ns.nl",
          },
        },
        {
          id: "R0-S2",
          type: "pedestrian",
          departure: {
            time: "2025-09-30T09:46:00+02:00",
            place: {
              name: "Amsterdam Sloterdijk",
              type: "station",
              location: {
                lat: 52.388562,
                lng: 4.83716,
              },
              id: "21260_61838",
              platform: "7",
            },
          },
          arrival: {
            time: "2025-09-30T09:56:00+02:00",
            place: {
              name: "Amsterdam Sloterdijk",
              type: "station",
              location: {
                lat: 52.389758,
                lng: 4.838497,
              },
              id: "65528_2878",
              code: "AMD",
            },
          },
          polyline: "BHojunnfg5ro8CwrX0ja",
          notices: [
            {
              code: "simplePolyline",
            },
          ],
          spans: [
            {
              walkAttributes: ["indoor"],
            },
          ],
          transport: {
            mode: "pedestrian",
          },
        },
        {
          id: "R0-S3",
          type: "transit",
          departure: {
            time: "2025-09-30T10:05:00+02:00",
            place: {
              name: "Amsterdam Sloterdijk",
              type: "station",
              location: {
                lat: 52.389758,
                lng: 4.838497,
              },
              id: "65528_2878",
              code: "AMD",
            },
          },
          arrival: {
            time: "2025-09-30T16:55:00+02:00",
            place: {
              name: "Hamburg central bus station",
              type: "station",
              location: {
                lat: 53.551767,
                lng: 10.011657,
              },
              id: "65528_716",
              code: "HH",
            },
          },
          polyline:
            "BHgkmonfg8lp8CgFwnK3kCA_xB4rBnGwpEAw7FoGgqUAwwDAwwDwtHoGouGnGo8E3SoqDnGg9DnGonHvMwiFnGvMwgpBoGghHwMojEgZg2EA42DAoqDAw-BAg-KgkDgrCo4BofgrCwMo8EvM4zH3kC4-JvwDw3CvlBwpEnfw8M_Yg2E4S4iN4SgsJwwDo1Fw3Co9LgoGwxKonHonHgvF4zHouGo5I4sIo5IgsJwoWo4awkTwhXw7FghHw8M4tPg4S48Ug9Dg2EwpEo8EwgQwrSwiFw7Fg2EgvFgxTo7Wo1Fw0Go8EgoGgrCgrCgsJwqLwpE4oFg2Ew7F4zHoyJg9DwiF4-Jw8Mw-BgrCoqD4vEo9Lg7O4lJwxK4wL4pMg-K43Kw5QwgQo9Lo9LokkBoyiBo1eg2dogI4zH44R4_QgiOw1NgvFwiF4lJw_IojEojEghH46Gw7FgoG4vE4oFgvFghHgzI4pMgkD4oFw0Go6PoqDghH4oFw8MwmI4uWgkDgzIoxCouGg9DgsJoqDouG4vEogIo1F4lJwpEg6HwpEgzIo4BojEoqDgzIgkD4lJgvFw9ToqD47NwiF4nXgrCwjMoxCooOw-Bo2M4kCo6Pw-B4_QgZonHgyB4jU4rBorjBoG4oenG47NvMw1NvlB48Un4B4jUvlBokLvwD49bv-Bw8MnxCohPv3C47N32Dw5QnfwpEv-BwmI3SgrCvwDgpN3vEo6PvwD4wLviF4tPn1Fo6P_5HgxTn1FgpNn5I4qT_rJ4jUviFokL_uFo9L3hG4iNnvNo8dviFwqL_yIo3TnjEglKn4BojEv7Fg0P_1Eo2M33K4hf_uFo6Pn8E4iNn2MongBviFwjMv3CouG3rB49C_xBwwD3pM49b3mQorjB_vMgyanhPoufvjMgnYv7FwqL_9KopV3oF4-JnkL41VngI4tPv3CgvF_jDgoG_1EoyJv_IowU_yIg8VvpEg3Lv-BgoG_nGwkTn1Fo3T3hGguXn4Bg6Hv_IoyiBv7F4jU_uFwrS_1EwuOngIwzYn8EooO39Cg6H3kC4hG3kCo1F3hGwgQn4BwpE_8Dw4J36GozQvqLwsZngIwyR3zHwnP_oNwsZvtHovNn9Lw2U_kKgtQv4JwnPv_IovN_1E46G3zH43KvmIg-K_yIg-K3sIglKvqL4iN_gHg6HngI4sInvNovN_5HonHn1FwiF_jDw3Cv7F4oF3wLw4J_8DgkDv8Mg-K3qTozQ3-J4sI3_Q40OnyJwmInxC4kC3rBwlBv-BgyBn_Z41VviF4vEn4B4rBnnH4hG3wLw4Jv_IghHv-BgyBv4Jg6H32D49C_6OokL_vM4sIngIwiF_yIwiF_8DgrC3wL4hG3lJg2EngI42D3vE4kCnqDgyB3hGw3Cv4J42D_sQo1F_iVw7Fn2MgkDn1FwlBvqLo4BnoOo4BnqDwM3hGwM3iN4SvgQA_vM3S_hO3rBnnHnf_sQv3CnjE_YvnP32D3sInxC_nGn4Bn1Fv-Bn5I_jD_1En4B33KnjE3oF_qC_uF_qCv5QvmIv8Mv0G_hOvtH3lJviF__Y_oN_iV3wLvwDv-BvgQn5Iv-BvlB3wL_nG3hGvwD_kKn1Fn-rB__Y3plBnpVv3C_xB_kKv7F3lJ3oFv0G_8D_2L36Gv4Jn1F3sI3oF3vEnqD3vE_1En4B3rB_5Hv7FvpEnqDnqD_jDnqD32D_uF_5Hn8E_yI_1EnnHv-BnxC_8D32D32Dv-BnjEnf_8DoG3vEgyB3vEoqD39CgkD32Dw0G_qCw0GvlBwiF_YghHnGo8EAo1FgZwhX4SwrSvMg_Rnfw4J_xBw_InfwpEv-BwtH39C4lJvlB4zHviFw1N3zHw2Uv_Iw6X30O4wkBnjEoyJ3kC4oF_jD4zHnxCw7Fv3C4hGvyRo2lB3vEo5I_uFgsJ_vM41V33KwgQ_oNg4SngI43K_1Ew7F32cw4iB36GgzI_oNwyRv-Bw3CvlBgyBnyJ47N3wL4_QnyJwgQnrKwrS3rBoxC3zHg7OnqDw0Gv_IosRv0GooO_xBw7FnfojE_Y4kC_5Ho3TnnHo3Tn5Iw3b_jD4lJ3zHg5ZvwDwjMvtH42c3kC4lJvpEgqU39CwnP3vEo4anqDo7W_8DgsiB3rBwyRvlBo-Snf45YvMw_hBnG40OwMoiWwM4zHAo0X4S4gYvMolrBAw0f_Ywla3rBghgB_Yg-K3rBgjV32DgpmB_xBw1N39Co0X3kC47N_uFoghBn4B46G3SoqD3oFwjlB39Cg4SnqDw9T_8DowUvMo4BvtHo6oB3oF42c_5Hg7nBv_Ig4rB_-Rg2vCvtHw0fv_I4wkB_vMg1vB3tP4z5B3lJongB3Sw-B_gH4nXngIoqc_xBgvFvtHw-an1Fg1Wn2Mgo4B3vEoiWvtHwgpB3kCgiO_5Hoq1B33KoihDvwDwwcnjE42c3oFoghBv7FwtgB3vEg1W_9Kg5yBvjMwhwBviFg4S3hG48U3_Qw73BnhPoq1BnhPo4zB_gHgnYnyJorjBvwDg7O39CwuOv3C44Rn4BwyR_Yw8MvM4iNAgvF4S4mQw-BopVgyBo9LoxCwuO4kCw4Jw-BogI42D4iN4hGg4SghHo3TgpNgljBwmIo7WwqLwpdwlzB4ppEwjM4hfoxCw0Gw4JwhX4rBgkD4oFo9LosRg7nBw7FgwM43KopVw8Mg5Z42D4zHw7Fg3Lw-B42D43K48U4uWo3sBwiFw4Jg7nB42uC4gYg1vBw3CgvFo6PoufwvVwyqBgyaox0BovNoxbwsZg91Bw5Qo9kB4vEw4Jw2UwovBwqLotYgmRohoBgpNg6gBokLoqcw3CoyJwuOwnoBokLoqcw_I41V4kCwtHgrCwiF4-Jg1WoyJwhXwqLojdoiWwx8BouG44R4-Jgrb40O4toBokL4oeg8Vg-8B43K4oeoyJw-a4oFg7OgiOwgpB46G4jUo5Ig5ZoqDw4J46GgjVg6HwsZgoGwhXwiFgxTw3C4wLoqDwuOg9Do-Sw7FoufoxC4tP4kC40O4rBgsJwlB4sIw-BolSgyBg7O4rBgiOwlBg0P4kCwxjBoG46GwMwxKwMg-jBAo1FnGw7FAw3CA49CAgkDnGgvF3So-SvM4sI_xBw-av3CghgBn8EgtpBn1FgwlB_8DwhX_uFghgBnqDo3Tv7FohoBv-BgtQv3Cg2d3rBo7W_Y4_QvMgwMnGgjVoGooOwMgiOofw2UwMw7FgZ43Kw3Co8doxCgqUw3C4jUwiFojdwwD4_Qw-BgsJw3Cg3Lo1Fg8V4vE4mQg9Do2MouGo3Tg6Hg1W44R41uBgzI48U4vE43Kg9Dw4JwgQovmBo5IwvVo3Tw6wBonHg_R4oF4tP49CghHo1FwuOwlBoqD49CghHgzI41Vg-K4kbwgQ4imBgoGwuO4-J48UgvFg-KwqLgjVo5IwnPwgQomZgjVg2dgwM4mQo2MwnPwjMovNouG46G4lJ4lJ4lJo5IwpEg9D4vEojEgzI4zHowUosRwhXo-SwjMorK4pMg-Kg7OwuOgkDgkD4-JorKg2EwiFgoGghHwoWo4agvFghH4vE4hGw8MosRw_Iw8Mo1FgzIghH43KglKgtQojEw0Gw7FglK4pMo7Ww9TgmqBovNo1ewhX4h4BorKgrbw7FgtQorKojdg9Dg-KghH4jUo6Po3sBgrC4hGwwDglK4vEo2Mo8E47Nw7FosRo0Xg0hCg8Vw47B4wLoufw_IwzYg3LongB4pM4shBggyBwxnEojEwqL49CogIgoGgmRgrbg9uCwuO40nBwxKoqcg-jBwy8CwxK4kbg6HgqUg2EwjM4_Qg4rBoxCw0G49CwtHo5IwoW4vEg3LgnYwq9BgiO43jBo0Xw47BwmI48Uw6Xw_6B4iNwtgBw6wBgx3DwpdgxlCw7ewvnComZ464Bg7nBw83CggZ421BooOwiew3Co1Fw3bg65BorKgjVwwDonH4lJ4xS4oF43K42DwtH4-iB4qlCw8lB4npCo_Z4gxB4toBomrCoxC4vEgpN4gYw9TgljBwqLw9TohoBo3lC4nX40nBg4Soufg-KwrSwlBo4B41V43jB4qTouf4kbwrrBox0B4zyCwwDgvF45xBo4sCw-sCo33DgoxC4y9DgzhBox0BgyawgpB4uvB4gqCgofwsyBwhX4plBwqLo-SomZ44qBoxCojE4sIooO4wL4jUorK44RgyBw3Co4B49CgZ4rBg8VginBgpN4gY4_Qg2dw6X4_pBgoGg3Lg4SorjBwrSwxjBwpE4sIgveor8Bw5Q4liBg2Ew4J41Vo3sBw6XwsyBg0Pw_hBgwM49bwuOgljB4hGgiOgvFg3LoqD4zHo4BwwDg2Eg-Kg7O4shBw_Iw9Tw0G40Ow3C4hGw3CouGgrCwiFo8E43KovNwie4wLotYw_Ig_R4pMo0XgwMo7Wo5IwnPgsJg0Pg7OguXohPg1WwvV4oewiF46GgvFghHguXwwcgmRo3TolSo3TwjM4pMg4Sg_Rw2U4xSgpNokLgkcwvVo2Mo5Io7WohPwyRorK4vd4tPohP46G4hGw3C40Ow7F42DgyBwxK42DwrSouGg3LwwDo-So8EwqLoxCwrSwwDgwMw-Bg4S4kCo0XgyB4gY4SgtQAg_RAw6wB_Y4jUnGg6gB_Yw7FnGghHnGgrb_YwzxBv-BgtpBn4BgxTnfoytD_gHgqU_xBg2d_qC49b_qCggyBn8Eo1F3S46G_Yg2dnqDosR3rBgiO_xBg6Hnf4uWv3C4jU_qC4zHnGw_IvMglK_Y4oF_Y4wL_jDw7F_YoivB_uF4kbnqDoyJ3rBgsJnf4qTvlBg2EnGw4J3SgiO3Sg0PoGgtQofw6X4kCohP4kCohPw3CogIgyB47NgkDwvVw7F4zHgrC4tP4oFopVwmIw2Uw_I4qToyJgxTwxKw1NogI46GwpEo3Tw8MgpNgsJgwM4lJwrSwuO44RwnP44R4mQg-KwxK44R44RwyRolSg_RwkToqcgvewiFgvFo7WwsZgiO4tPg5Zwpdg_Rw2Uw3b4zgB41Vo_Z4oFgoG4oFgoGwpE4oFo8Ew7Fo1FghH4nXg9covNgmRgwM4_QwmIo9Lg3LwrSwtHgwMg-K4jUw0GgpNouGw1Nw7FgpN4lJoiWgvF40OwiFwuOonHwoWouGwoWw7Fg1WouG42c4hGouf4hG43jBgkDwkTgoGgwlBgvFgzhBojEggZw7ForjB4wLowmCw0G4toBwunB4twHgsJon5BwzxB4kuJojEggZo1FgsiBg9DgnY4hG4wkB42Dg8V4vEgnYgoGg2d4vEgxT42DgpN4kC4zH46GguXoqDorKwiFg7OghHg4SghH44RgzIo3T42DogI4iNgyagsJwyRwgQ4oe4hGokLghHw8MowUginBgrC4vE4rBoxCg0Pojd40gCg85DgrC4vEgZ4rBgzI4mQwuOgrb4-Jg4S47NggZgpN4nXwjMw9TovNowUwuO48UglK47NgsJ4pMwuOolS4_QgqUwyRgxT44R4xSg9Dg9Dg6Hg6Hw8M4pM4xSgtQg3Lw4Jg3LgsJo7WgmRwuO4-JgxTgwMwlawnPgpNonHo6PogIo2lB44RgpmBozQ4yZwxKwzYglKg_RwtHg8Vw_IopV4lJosqBo3TouGoqDouGgkDw0GwwDouGwwDwjMw0GwlawgQw1Nw_I4xSw8M4iN4-Jw9TwgQ4jUwyRovN4pMo6Po6PgnYg5ZgxT4uWgwMwnPosRg1W4-JovNg-KwnPw_I4iNglK4tPgsJwnPgzIgiOovN4nX40Ow-awqL41V4pMwzYo6PgzhB4oF4wLoqDonHgzIg4S41V45xBg9gEo1xJw7F47NwtHwyRgl1Cw-pGwnoBow_CgwMo8dotY4s6B4jUg1vBw3ConHouGooOwgpBwhiDwgQg7nBoqDgzI4kCgvFoxCgoGgvFg7OghHwrSw-Bo1Fg-Kwiew3CwmIg6Hg1WgkDw4JoxCo5IwlBgkDgkDgsJgkDorKgoGg8V4sIo1ew-BwtHgyBgoGwqLo7vBwmIovmBw-BwxKwpEw6X4kCw1NgyBwjMwlBg4SoGgvFnG4sIvM46G_xB4pM3kCwjM_xBwtHvwDo6PnfgvF3So1F_Y4wLoGo1FgZ46GofgvFofojEoqDglKw-Bg2EoxCwpE4oFonHgkDgkD49CgrC4kC4rBo8E4kCwiFwlBo1FnGoxC3S4vEn4B4vE39CwpEnjE4vE_uF4kC_jDwpEnnH47N39boqDn1Fo4BnxCgyB3kC49C_jDoqD_jDgyBvlBoqDv-BojEn4B4nX36GgsJvwDo4BvM4vE3SwpE3SwpE3S4vd_8DopVv-BgoG3SglK_Y40Ov-B43K_YoziCvpEonH_YgkDnGg2EnGg9DnGongB3kCo3T3rB4mQnfo6zDnnHw7F_YouGA4mQvlBwxK3SogI3SgzI3SgupCv0Gg4S_qCogInforjB_1EgtQnxC4_pB3zHwwD_Yw1N39Cg8VvpE47Nnfg5ZnqDg_R3kCg_Rn4BgnYv-BwgpB3kCov_B_Yw6X3S47N3S4wL_Yw6Xn4BosR_xBwvV_qCg0P3kC4uW_8DovN39CgupCn-So82B_6O43K39C4rannHooO_1Eg_R3oF46G_qC4zHv-B4hfv_I40O_1EgmRn8E48tB_hOokkBvqL47N_1Eo2M_8Dw5pB3iNw6X3zHgy-DnhoBokLvwD47NvpEo5Iv3C4vvCnmZgmRn1Fg1WngI42cnkLwhX_rJ47Nv7FonH_jDo5I_8DgqUnyJoyiB3_Q40OvtH40OngIwuO_5Hg1vB3kbwyRnyJ4gY_vM48UvxKgmRngIg7O36GgmRvtHw2UvmIgpN_1EopV36GozQ_1EwqL39CorjBn5I4tP_1E4qT36GwgQ3hGozQnnHwnPnnH4mQ3sIg8V3pMgvFnqDw9Tv8MgiOv4Jw4J_gHo6Pn9LwuOn9Lg-K_rJopV3qT45xBn0wBwrS_-Ro2-B3w9Boxb_xao6PnoOw2UvyRo8E_8D46Gn1F4nXvyRo9L_yIo9LvmIwqLvtHoyJ_nGglK_nGwqLnuGozQv_IoyJ3oFw_I3vEolSvmIgxsB_pUw_hBnhPoqc3pMw5QvtHokL3vEwxKnqDo2Mv3CgsJvlBorK3Sg3L4S4hG4SorKo4B4lJ4kCoyJgkD4vEo4B4lJojEwmIojE42D4kCg3L4zHwtHgvFwpEwwDgzI4zH4vEwpE4lJoyJw_IorK4vEo1Fw_Io9Lo23Co-2DgiyDwi7Eg0P48UwqLwuOwtHw_I46Gg6Hw1NwuOwmIogI4sIwtHojdotYg2E42DwlBofgyag8VowtBgwlB4uWo-S41Vw9TwuO47NwxKwxKggyB4yyBoiWwoWomyB4yyBwrSolS4lJo5Iw1No2MgxT4_Q4lJg6HwmhBgrbw3CgrCgveomZo9vDgm8Cw6X4qTojE49C47No5Io6PgzIo8EgrC43K4vEwuOo8E4mQg2EwllD49bwzY4zHwrrBo9L43KoxCw4J49Cg7OwpEooOg9D4tP4vEwj-B44RgtQ4oForKojEorKo8E4wLw0G4wLonHw-ag_RghHg2Ewt2Fop5DopVg7OgvFojE42D49Cw_IogIw_I4lJ4zHo5IghH4lJ4zHg-KoyJo6Pg9D46Go8Eo5IwmIohPw5Q4oegiOomZgvFgsJwvVg-jBw7FgsJgpNg8VwrS4oeg-K44R4mpBg4kCw0GorK4rawrrB46G4wLgzIgiOg7O4uW4kCoqD4vEghHorKooOovN4xS46Gw_I4uWoxbg_R4qTw4J43KwpEwiFghHw_Iw7F4sI46GwxK4hGwxKo1F43KwtHwgQ4vEokL42D4-JgvFozQw0GotY4kCw_IgrC4pMgrCgiOw-BgiO4kCowU4SglK4Sg_RoGgrbv-B4zrD_YoioCvMwrrBnf4rzBA4-JwMg8VgyB4vd4rBwnPo4Bg7OojEgya4oFg5Z41Vgx-CwtHg6gBwgQgqmCw9Tgp4Co1Fw-a4kC43Kw0Gg-jB4vEoqc4rBg6Hg9D4nXo8Eoufg9D45YgvFo1e4kCwnP4-Jwq9Bw-Bo2M4kCooOg8Vg-nE4iNo1wCw3CgmR4kC4iNgZg2E4S42D4SwwD4rBwmIo5Io82BgrC4tPoqDwkTwwD4xS4kCgsJ4oFw9T49C4-J49Co5Ig6HgjVg3Loxb4zHwyRgrCgvFw3CouG4rBgkD4kCo8EokL4yZ4iNw7e43KwlaoghB4-0Cg9D43Kg9DokL4rB42D4kC4hGogI41V4oFg7O4_Qw-zBw8MgtpBgzIgkcw3CoyJgrCgsJ4vEg0Po8E4xSoxCgsJg2E44RwtHwpdonHwieojEg_R4jmCw2gKg-Ko0wBo4BogI4kCgsJg7O4thCg4S4owCglK4xrBgkDgpNo1F45YgwlB43gFoufw4mEwiFwkTwwDwjMg9D4pMwpEgwM46GolSwtH44RgvFo9L4sI4_Qw7FokLw0G4wL46Gg-KwxKg0PorKw1NouGogIgkD42Dg-Ko9LgtQg0Pw5QooOgmR4iNw_IouGowxEwskDg0oBwpd4nXg_R4-JogI4oeomZwx8Bg91B42cg5ZgxTwyRglK4lJw0Gw7FwhwBg_qBw5Q4tPwpEg9DwjMg3LwwDoqDwla4ragpNooOwzxB4o3BwqLo2Mwieo5hB4-0C4q-CogIw_I4sIgsJ4jU48Uo8Eg2Eg0oBohoBog6Bw73B4vEwpE4-jIg56H48U41Vgz6BoogCg_R4jUw0G4zHo5I4-JozQolSgmRg_RovNovNg2E4vEouGo1FghHonH4-iB4liB4lJo5IongBgofwtyC4owCgqUgqUw73B4z5B4mQgmRw3_Dw4mEg1Ww6XwyR4qTwuOolSonH4-JgoG4lJgzI47NwlBw-Bo5Ig0P4oF4-J4hGo2Mg6HolSg6H4qTg2E4iNojE4pM4sIgrbouGwhX4S4kC4Sw-B4rBg2EohPww1B4_Qor8Bg9D47N48Uo7oCw7eojoDgiOwzxB4pM4jtB4uWwj3CorK4wkBwmI4kb4sI4raogIotYogIo7Wg4Sgr0B46Go-So4Bo8EwyRo0wBwjMo5hBgoGosRw_IggZgzIwzY49CogIgrb4rsCwpE4wLo4Bo8Ew3C4sIw0G4_QgzIw6X4pMw_hB4kC4hGo4Bo8Ew2Uw04BwiFw8MghHw5Qw4JopV4zHo6P49Co1F40OgyawxK4_QwxKg0Pw-agpmBwsrC4opD49CwpEg2Ew0Gg2dozpBwxKg0PovN41Vw_Ig0Pg-Kw2UwmIgmR4zHgmRo8E4wLoyJw6Xgof4hxCgjVg22Bg0hCgqqFgrCw7Fw_IguXgkDogIgkDgzI42DgsJgkDg6Hg9cggrCwxK49bgvFg7OgqUok9B4vE40OghHotYgmRg7gCgmjC4ljIg4SosjCwpEwnPot8D4j9Nw7FgjVokL40nBwpE4tPg_Rgp_BgzhBwv5Dw5Qo56BgsJo5hBo5Io1e4rBwiFwlzB4h1F49C4-JwwDgpN4vEwgQwjM4mpBw4J4oe43K4vd47N4-iBoqDogIongBo8vCghHgmRo2lBol9Co-Sg8uBwtHwkTg2EgpN46GowUwpE47Ng6H42c42D40OoqDohPw0GongB4rBonHgrC4wLwqLw73Bg6HoonBw0Gg6gBw2UgknD4_Qor1C4jU45jDgzIohoBoxCgwMghHgveo1Fg5ZosRw3tC42DwyRg6Hw4iBoqDohPw4JwksB4zH4-iBo6PwvnC4vEo3TgiO47_BgkDw1N4hGggZovNgk1BonH4rag2EozQouG4uWonH4gY44Ro82B4xSww1BglKgrbgtQ4_pB48Uww1BwuOg3kBoqDo5IwqL42cgrCouGo8EwjMguXw47B4xSwovBoqDwmIwMwlBo8Ew8M44Rw9sBouG4_QwnPgpmBgkD4sIgrCgoG42DoyJ4jUo4zB4kCo1FwtHgxTooOokkB4hGwgQo1Fo6PogI45Yw0G4uWojEg0Pg9D4mQ46Gw7eopVomkDouGwtgBojE4gYwpE4hfw3CwsZw-BwsZwlBgxTw0Go2pEg9Do5zC4rBw3bgoGgojEo4Boqcw-B45YgkDw_hBw-B44Rwlaw11GgyBo2MofwtHg9Dg5Z4vEwlaghHwtgBo7vBojsGw-B4sIgzIwjlBwpEo3To5I4qsBwgQw40CgiOwzqCg6HolrBgkDw5QojE4gYw-B47NgyB4mQ4SgzI4So5IoG4sIoGguXvM47N39CwklC_xBg-jB_xBgpmB_qC4k0B3rBgjV39C4gYn4B4wLnxCgpN_8D44RvwDovN3hGopVvlB42D3mQgv3B3sI4kb3iNgxsBn1F4qTnfwwD_8DwjM3pM4toB32Dw8MnyJokkBnxCglK39C4wLv7Fo0XnfwpE_qC4-J_jD4iN_1Eg8V36GoghB3lJ4gxB39CwyRvlBgoGvwDwvV_1EwxjB_qCwkTn4BozQ3Sw0GvlBoqcnGo6PoG47NwMovNgZw1NofovNofw_IwlBokLgyBorKgyBorKw-B43KgkDooO49CgwMoqDo2Mw7FwkTwuOgqtBgzIgyag2EwuO4kC46GgZ4kCo4BgvFwtHg1Wo9LwjlBg6Hw6X49C4lJwiFo6P49Cw_IgZw3CwMgyBghHguXgyBo1FoxCoyJgkD4pMw-Bg6Ho1Fwla4oFo_ZgZwpE4rBw0G4SgkDwpE41V4SogIojEwwcwlB46GoxC40O4S42D4S42DA4hGvMojE3S49CnfgkDnf4kCnxC42D3kCgyB32D4rBvwD3S_xB_Yv3Cv3C3rB3kCnfv-B3S39CAnxC4Sv3C4zH_qC44R_1Ew7F_xBgrCAgkDw3CgyB49C4So4BwlB4rBwlB4SgyBoG4kCAofnGgyBnf4rB_qC4Sv-BoG_xB49Cn4Bo4BvMgrCnfwpEnxCw-BvlB4kC_xBogIn1F4_QnrKw6X3iN43Kn1FgwM36Gw0G32DouG_qC42D3S4hGvMo4B_Y4lJgZ4rBoGorKwlBwwDgZwwDofw3CgZ4vEw-Bo1F42D4kCo4B_jDwjM_8Dg_Rv-Bo5I39CohP3Sw_IAgiOA4kCA4kCA4kCwMwvLoGgjGofolSofonHgZ42D49Cw8MoxCw4Jg2EgxT4kCg6H4vE4_Q4kCwmI4kCghHwlBwwDoxCo1ForKwkTwpEgzIgrCojE49Cg2EokLw9TgrCwiFgZojEnGwiF_Y4zH3SgyB3SgkDnfonHnGwqLwMwiF4SwwD4rB4vEgyB4vE4So4BwlBoqDwpEo2Mo4Bo8Ew3C4zHwpEo2MoxCwmI3hGonHvpEo1FnjEgoG_nGorKnqD4oFnuGg-K_vMopV36Gg-K39Cg2E39Co8E39CojEv-BwwD_5Ho2Mv3C4vE39Cg2EnqDwiFvlBw-BnjE46Gv-Bw3Cnf4rB3vEghH_uF4sInxCojE_1E4zHvuOwoW_kKozQnqDgvF_8DouG3rB4kC_qCwwDnuGwxK3yZ4mpBngIw8M3hGw4JnkkB4s6BnzQw-anjEghHvwDw7F3kCg9DviFwqLvpEwjMnqD4iN_qCovN3rBgiOvMokLwMgpNof4wLo4BokLw-Bw4JgyBouGoqDgiOwwD40O4xSoquCoxCwjMwtH46f46Gg2dojE4nX4kCg7OgyBgiOgyBwoWwM4lJoGwjMoG4xSAghHA4sInGonH3SwkTA4iN4SovNgZ4pMwlBw1NvMogIvMgrC_xBg2En4B49C_gHgkD_jDw-BnxCgrC_qC49C3kCg9Dv-BwiFnfg9D_YgvFn4BwyRvlB4hGv-BonH3kCgoG3kCwiF_kK4jU32Dg6H_qCo1F_xB4oF3sIgqUvmIgjV3lJgrb3oFosRvmI4hf3oFg1W3vEo7W32DwvVvwDgnY39CggZnxCgyan4Bgya_Y4xSvMo3TAowUwM4jUgyBosqBo1F4tzD4kCw9sBofowUw-BginBwmIg0lFwlBoxb4Sw-aA44RvM44RvlBg5Z_qCongBnxCgnY_jDotYnxCozQ_uFgve_1Eg1WnjEosRvpEgtQ36GgnYn8E4tPviFohPv8Mw_hB_gHw5Q3sI4xSvjM4gY_jcoq1B_g5B4ssDn8dou4B_gHgpN32DghHnyJg_R3rsC4jxE38tB4w2CnoOw-a31nC43nEnoOgyankL48Uv5QwmhBvjMg5ZvtHozQnhPgljBv_I4nXn5Iw6X_yIo0XvmI45YngIwsZv4Jw_hBn8EwyRv0Gwla_nGo_ZnnHoghBnyJo0wBvlB46G_1Ewie_jD4qTviFginBnqDoqcnxCoqcn4BoiW_xBwvV_xB4ravlBg5Z_Yo6oBAo3Tof4w9Bo4Bg49CAgsiBnfg-8BvlBg-jBnxCguwBn1Fg75C_1EwtyCn4Bo9kB3Sg-KnxCwj-B_xBg4kC3SomyBnxCg1sFAghHnGovN3Swx8BnGwyRnGwwcoG4_0D4kCwk3Dw3CghyCgsJg5hHo4Bg4rBg9DwohDo4BopuB49CwooCgkDgupCoxCw1_BoxCgs7B4rBg9cgZg4SwwDwj-BwlBwkTgkDg_qBo8Eok9Bo8Ew30BogIo_rCgvFgqtBgrCwrSojEwtgBw4J4xkCw0Go6oBghHginBo1F4kbo1F4ragoGgya42DgiOwmIw7eo1FgqUgrCwmIwiFw5Qo9L4plB43Kw7e43KojdgiOorjB4liB4vvC4lJ48UgoGohPggrCw6tFg3L4kbotYwt5BwqLgkco5IwzYgvFozQ4oFgmR46G4yZgvFg1Wg2EoiWwpE4nX4rBogIwlBwtHwwDg5Z49CwlagyBolSgrCg7nB4SwvVAwkTvMgmRvlBoxbnf4xSv3Cgve_jDgkcnjEwlanqDg4S_nGo1en4Bg6HvtHojdvpEohP_gH4uW_1E47NngIg8V3oFw1N3sIw9T3lJgxT3vE4lJ3lJosR3_Q4vdvnP4yZ_2Lo-S37NwoW_iVg6gB38Uw0f3xS4kb3nXg6gB30O4jU_2kBo0wBngIorKvmIglK_yI43K3jU4kb_3Sg9cv7FglK3wLgjV_9KoiWnjEg6HnvNwmhBv_IgnY_nGg4Sv7Fo-S3oFg4Sn8EwkTvpEolS_6OgigCv5Qw6pC3kCw_I_k8BgpnInzpBg2zF_pU474C_nGg5ZvmIwtgBn9LolrBnyJw0fv_Igkc_sQwhwB3oFg7O_hOw8lB_5Ho3Tv_IwvV38UoivBnyJg8V3lJopV3mQ4plBnnHosRn8E4pM_kK4kbv0GgqU_nGw2U_nGg8V_uFwvVn1F4gY_7Vg5kD3oFg5Z_jDgmRnjE45YnxCgmR_8D4vd3kC48U_zPwroFvtHw3tC3S43KvMg0PoG4xSof48Uo4B4jUofwmIoxCgmR49CwgQgvFw6XwpEo6PgrC4zH4oF4tPw_hBgq_CogsDouyJ43Kg2dwtHg4Sw_IgjV43KwzYo2Mgya4lJ44RwyRw0f4wLgxT4tPw6Xg91Bw3tC4hGgsJw7Fw4J4oFgzIghHo9LgsJozQgsJosRo-S47mB4lJgqUw_I48Uo1FooOw7Fo6PoxCouGogI4uWglKo1e4lJoufg4rBwm-EwtH45Yg-KoghBo5IgnY4hGwgQoqDogIouGg0Po6Pg-jBopVwhwB4mQokkBgoGgiOgtpBwy8C4sI4qTwiFovN4vEwuOg9Dg7O4vE4nXgrC4mQ4rBgtQ4SozQvMggZvlBgtQ39Co7W_xBgzInfo1F_xB46G3vE41V_YoqDnxCg3Lnf4vEv3Cg3LvpEo3TnjE48UnqDgjV_8D43jBn4Bg8V3rBgnY3SwhXgZg3kBgZwkT4kCo0XofwxKgrC4jU4oFwmhBoqDw5QgrCorK47N4w9B47Ngl8Bg-Ko7vBo8E48U4hGoqc49Co2Mofg2EoxCg3LgkD40O4kCorKo5IozpBgrCw8M4kC4iNgrC44R4kCozQw-B4nXwlBguXwMgofnGogInGohPnfgxT_xBwkTn4B4mQ39CoiW39Cg_Rn4B4-JnjEw9T3rBgoG39Co9L_8DohP_rJo8dv-B4oFn5Iw6X36Go6PnnHg0Pn5I4_QnhPw-a_lRw3bnlS4kbn9kBww1B3xS42cnhP45Y3mQwwc_5Hg7O3tPgvevuO4hfvgQwjlB_2Lw3b_rJowUnxCo1FvmIg0Pv3C4oF3sIgiOvmI4wL_yIg3LvjMw1NvrS4qTn1F46G3zHgpNvpEo5I39C4zH_qCg6Hn4BogI3rBogInfoyJvMgzIwMo9LwlBwqL4rB4zHw3CorKg9D43K49CouGo4BoqD42D4hG42Do8EojEg2EwpE42DwpEgkDoxCgyB4oFgrCo8E4rBg2E4S42DAw-BnGw7F3rBw5Q36GgvFn4Bg9D_Yo8EnG42DwMg6Ho4B4vE4rBo3T4wLw-BofgoGg9DohPoyJ4gY4mQ4_Q4wLwiF42D4uW4mQg0Po9LgqU4tP4iNorKw_IghHo9L4-JoqDw3CgnYg4So1FwpEoxCw-Bo4B4rBwvVwgQo1FojEo1FwpEgvFg9DgpNo5Io8EoqD4_Q43K46fwrSgsJg2EogIojEowUorKwlao9LoogCw3bojvCgzhBwj-Bo4a4uWorKohPwtHokL46GopV47N46Go8EgmR47NgjVgqUg0PgmRogIoyJghHgzIg-K40O47N48U4iNwvV4pMg1Wg3Lo0XwmIwrSg6Ho-SwqLo8dgkDoyJwxK43jBwwDgwMgzIw4iB4-JwrrB44qBo0mGwlao76Do8d4iqE4hGoxb4sI47mBw3Co2MouGo1eo9L4h4B4wLgo4Bo1FwwcwiF4ra4vE4uW4oF4kb4-Joq1BohPo23CwlBghHo4BwxKo4BwxK4vE42co4B4-Jw7FoghBgyBw_IofgvFo4BglK4vEo7WgzIosqBw-B4lJgzIwxjBoxCoyJouGgnYoqDwqLg6Hg5ZwlBwwDgkD4lJg2EgiOgzIgnY4vEg3L4vE4wLglKwzYof4kCgrCwiFg9Dg6H46GooOwqLomZ42D46G42DonHwuOw3bo8E4lJgrCo8EonHg3L4sIg0Po6PgrbwzYg4rBwtHgpN4vEonHojdwsyB4zHgiOwiFw_I42D4hGw0Gg3L4wLgqUw8MguX4vEogIoxCo8EgvF4lJw-BoqD4sIohPwtH4iNwqLo-SoqDgvF4vEg6HohPgnYw8MgxTo8E46GgjVo8d4_QguXgpNgmRgtQowUg6HgsJwjMooO42DwpE4yZwie49CoqDgrb4shBg_RguXg_RwzYgpNwkTozQomZ47Ng8VooOw6Xw4Jw5QwnP4kb4zH47N4wLwoWw0Gw1Ng7O4oeg3LomZokL4yZoqDg6H4kCo8EwrSw2tBg2E4pM4wL4hfouGwrS4hG44RouG4jUgkDoyJg2EooOw4JwmhBg2EwgQw3CorKg2EwyR42DgpNg9DohPw_I47mBg3Lgk1BwlB46GoxCw8MwiFwla42DgjVgzI490BonHw-zB4rBokLouGg-8BoqDoonB4kC4vdo4Bwpd4rBojdo4Bo56BoGwhwB3SwvuBnfwpdnfo1en4BwtgBvlBohP_xBwzYnfg7O3vE4k0BnfwqL_rJ45jDvwD4mpB_YogIn4BoiWn1Fo99B3vEoq1B_uFg2vCvpEgysC_8DosjC3rBwvV3rB4ra3rBoiW39C40nBviFgz6B_YghHnG49Cv0G4-7B3rBg3L_jDwhX3vEg6gBv-BgwMvlBorK3kCw5Qn1F4mpBv0Go4zBvpEw_hB_jDg2dv3Cg5Z3lJ49mDv0GolkCnoOou8EnqDgljBv-Bo-S3vEosqBn5Io_rCnfgzIv3Co_ZnxC4jUvlBwmIvyR4q3Dv5QwllDv0GwjlB3hfgywFv7FwmhBn8do-oFviF4vd3-Jgo4B_rJg91Bv0GgwlB3oFwpdngIw9sB3oFo8dv-Bg3LvwD48U_nG4imB_qC40O_uFokkB_qCohPnuGwksB3zHgh5B3hGw6wB_nGoq1BnuG4p-BvmIwg7Cn1FgysC_uFok2C_jDg65B_jDwrkCvpEwnzD3kC44jCnfo2-BvMgnYAgjVoGghgBoGgnY4rB4s6BoxCwrkCoqD4s6BoxCwjlBojEgyzBgoGgmjCwtHgmjCo5IgtiCwmIgo4BgsJgz6BogIoivB40OgkuCw_Iw9sBw6XonrDokLoivBg4SgjnCgiOwzxBouGoiWg-KwqkBw7Fg_RglKw0f4vEovNoiWw1_B43Kg9c4mQ4xrBoqD4lJw7Fg7O47N4-iB4oF4iNo8EwqLogIw9T47N4liBgqtB43uDwvVww1BwnPovmBgyagxlCgvFohPolSwlzBonH48U4sIwlag3L4wkB4vEohPg0Poj2BokLosqB4lJgwlB4pMw30BgzI4mpB4kC43K4wLw8-BgxToz0DgyBgsJ4rBwtHwwD4xSwlB4hGw7Fg9c46G46f4-Jw5pBg3LowtBw7FgjVw1NowtBw0G48Uw_Iw-a4tPwrrBorKo4agsJguX4wLoxb4xSozpBw_hBwooCw9TolrBw8MgofgsJguXo5I4gY4sIwzY4zHomZghHg5Z4zH4zgBgvFo4aw7FgzhBg9DoxbgkDgrboxCoxbgyBw3bofgyawMw4JAwtHA4qT_YorjBv-BorjB_qCgkc32D4-iBvwDoxbn8EoyiB_nGo6oBnoOgp4C3-Jon5B_kKgo4B_zP4szC_5HwunB33Ko_yBn4BogIviFg1W_8DosR_8DwgQ_8DgtQ3rBw7F_YgkD_hOgr0B_2LgtpB_gHguXngI4ravpEo2M_xB4vE3vEwuO3Sw-Bv7F4_Q_qCghHvpEo2M_uFo6P_gHwrS3wL4oevmIw2U3hGg7O32D4lJ3_Qg0oB_lRgpmBnlS4imBvrSo9kB3mpBwpvCvwuCwz1E3oFglKvjM4nXnnHovN3wLoiW_jD4hGnwU47mB39CgvF_qC4vE30Ow3b_5HovNngIwjMvpE4hGvwDg2E_5HgsJ3pMovN3vEwiFv3C49C3hGghHv1N40O_rJ43Kv7F46GvrS45Y3vEw0G3oFogI3oFw_IvpEwtH_vMw6Xv_IwkT_yIgqUv0G44RnjE4pM_xBo8E3zH4yZ3oF4qTviFoiW_jD4tPnjEwhX_1Eouf3oF47mB32DoghBnxCgnYvlBg3L_8DolrB3kC4kb3rBgtQnqDg91Bn9Lwi0F_8D41uBviFgv3B3vEopuBvpEoonBv0G4s6BnuG4k0B_yIo99BvmIgk1B39CwyR3sIwksB_xB4zHnjE4xS3zH4hf_gH4yZvmIw3bv0GopV_8D4wLn5IwzYv7Fg0P_kKomZ_kKo0Xv0G40On2Mo_Z3iNggZ_yI4tPnvNg1Wn5I47NnvNgqU3-JgiOvnP4jU_kKo2MnrK4pM34Rw9T_2LgwMvkTo3Tnu4Bwp2Bn1eo8dn7Wo7W_hOwuOvxKg-KnzQ44RntYgya3wLo2MntYw3b3kbw0f3wLgpN_8Do8Ev3CoqDn8E4hG_lqBww1Bv0Go5I3wL4tP_2LgtQ_sQo0Xn8EwtHnkLosRvjMo3Tv4Jw5QnkL4qT39CwiF3kC42DnrKo3T_2L4uW_qCo8E36G47Nn2Mw-avkTo-rB3_Qw5pB37NwjlB30O44qBn6PwzxB3vE47N3-Jo1enrK4zgB3mQ4rzB_2LgljBvjMgzhB3-Jwla_kKomZvxKwzY30O4zgB3vE4-J3nXg8uBv_IgmR3tPw3b_nGg-K_6O45Y_kKgtQ_vM4qTvgQguXv9Toxb_uFghHv8Mw5Q3lJg-KvpE4oF_pU4gY3hG46G3zHg6H34Rg4Sv5QgtQ_yIogI37NgwMnzQg0PvuOo2MnrKw_Iv9TgmRnqDw3CnqD49C__YwvV3iNokLntxB44qBn7W4jUnziCwt5BnsRohP_m8Dg6rD30OgwMvxK4lJ_qCw-Bv7eo4antYwhX_qCoxCn4Bw-B_rJorKvmI4-J_9Kg7Ov4J47N3lJohPvmIwnP_gHooO33KguX_gH4_Q_nG44R_5Hw6Xv0G45Y39Co2M_xBgoG_nG4zgB39Co3TnjEwqkBvlBwjM3Sw7F3vE4nwBnxCwwcvwDw5pB32D44qBnxCg2dvlBw8M_jD4liB_qC4gYnqDoonB3Sw0GvM4oFvwDo2lB_qCw3bv3Cw0fn8Ew30BvlBgpN3SonH_xB4_Qv3C4zgB_jDo5hBnfg3L3rBwxK3rBw4Jv-BovN_nGo5hB3sIo9kBn5I47mBv4Jw5pBnvNgz6BnyJ4mpBnkLo0wB_1EwzYnGw-Bv3Cg4S_xBo2M3rBgiO3So5I3SolSAg4SnGglKAg0PvM4iN_YwtH3S49Cn4Bo8EvlBw-B_qCgrCv-Bofv-BoG3rBvM_qC3rB3kCnxC_xBvwDnfvpEnG32D4SnjEwlB32D4kCvwDgyB3rBwlB3SwlBvMw3CvM4zH3SoxCwMwtHofgkDgZ4zHw-BwtHgrCg9DgyBwwDgyBgvFgkDw-Bofw1NwxKghHonHouGg6HwwDg2EojEgoGw_IgiOglKosRglKgtQ4-Jw5QwmIooOgwMw2UgrCg9Dg2Eg-K49Co1FouG47Nw0Go6P49CgoGonHwrSvlBoxC_xBgkD32DghHv3C4oFnxCwiF_1EgsJv_IozQnqDojE39C49CnxC4rB39CwlBvnPwwDvtHo4B_qC4Sv3CgZ_kK4kC3hG4rB3mQ42DvwDof_yIoxC36G4kC32DwlBvpEgyB36GgrC_jDwlB_xB4S_nG49Cv-Bof32DgyB_xBgZv3C4rBvwDo4BvwDgyBvwDo4BnuGgkD3vEoxCvwDoxCviFg2EnjEwwDvwDoqD3kCw-B3oFo8E_1EojEvqLglK_2Lg-K_vMorKv-B4rB3oFg9D33KonH32DgyBn8EwlBnuGoG_1Eofv3CnqD39Cn4B_nGv3Cn8E_qC3zHv3CvpEvlB3vE4kC3rBofv3C49CoGo1F4SoxCofoqDw-BojEwwDw_I4rBwiFo4BgpNwMo1Fof4zHgyBghHof4hGoG42DoG42D3So8E3S42DnfgkD_YojE3Sg2EvMwiFAgoG4SghH4rBg6H_uFg2E3kCgrCn4BoxCv-Bg9DvlBw3CvlB42D3rB4zHvlBglKv_DkvYvzEsoc36G3vE3hG32DnqD3kCvpEv3CnvNnnHv_I_1EnqD_YnjEoGv-Bofv-B4rBv-B4rB3kCgZngIoG_uFnGnG32D3rBn5I3rBn1F3rB3vE3vE_6O3vEv5Q3kCvtH_xBnnHnf_nGnG3kC_xBnyJ3SvpEoG_1EnGnxC3rB3sIoG32DnG3kC3Sv-Bnfn4B_xB_xBnxCvMvlB4SvlBof_YofvjM_xB3rBnG_8D4kC3SwlBvM4rBnGgrCnGw7F3SwjM_xBgzhB3S4lJ3S4lJnGghHvMwtHvMouG_YwjM_YonH3rB4sInfg9DnxCghHv-BwwDn8E4zH_1Eo1FnjEg9Dn8E4vEn1F4vE_uFg9D3kCgyBvtHo8EnjEw3C_YwM_1EgrC_jDof32DwMnxCvMnqD3rB_jD3kCnxCv3C_jDn8E3rB3kC39C3hGnqDngInf3kC_gHvgQ3oF_5Hn1F3hG_hO3tPnjE3vEvwD_8Dv-Bv-BnqD_8D36GvtH_1En8EviFviFvmI_5HvwD39C32Dn4Bn8En4Bv-BnGvpEA_qCoG3kCA_pUgZ_yIwMn8EoGnjEnG_1E3Sn1F3rB_nGnxC_xB3S_gHnjEviFvwDn8EvwD3SvMv3Cv-BnvNv4J39C3kC_8D39Cv7F_8Dv-B_xBvwDwmI_8DglK32DwjM_1E41V_YgkDn4Bg2Ev3ConHn4BouGnfo1FvlBgzIvMo8EvMwtHoG4zHAgkDgZg-KwwDo8do4Bo2M4Sw8Mof4yZoGwwDgZolSg2EwmsDw-BwovBwlBo1ewMw_hBnGg_R_YwrS_xB4uW_8DgpmBvlB4zHn8Egof3vEguX36GoghBv7FotYvwDgiOn1F48U3vE40O3SoxCvtHgnY_kK4hfvnPw5pBvpEorKnyJguX_zP4-iBviFoyJnlSw_hBnuGokL3rBgrC31VokkB_rJ47N_-Ro_Z_xa43jB_qCwwD3mQ4jUn9kBwyqBv8M40O3_Q4xS_kK43KnkLwjMv7FouGnuGonH33KgwM_kKwqL3yrCg6yCvgiCg8nC_xzBw04BnpVwhXvpd4zgBnnH4sIvkTo7W_hOg_R38Ugkc_oNo-Sn9Lg_RnsRoxb3tP4ranvNotY_sQo1e_9jBw9lCv3bgr0B_-RghgBn9Lw9T_rJg7O_kKg0Pn8EghHvpEgoGnqDo8E3tPg8V_-R45Y_nfw5pBntY4shBnrK40O3pMolSvyRw-a_vMowU_rJwgQnrKolS3-JolS_-RorjB_1Ew4JnhPw0f33K45Yn9Lw3b32D4lJ3vEwqL_1EwjMvxKojd_8D4wLnyJ49b_qC4zHnnH4nX39CgsJ36Go0X_qCw_IvmI4hfviF48U3SoxC_2Lw-zB3hGgve_Yg9D3rBghHnxCwnPvpEwsZv3Cw5QvwD4uWnqDwzY3rBg3LnqD4kb_8DovmB_qCojd_uFw_zC32Dw1_BvpEo99B3rBwnPvpEwyqB_1Ew1mBvpEghgBv3C44R_5H490B_8D45Y_8D4yZn1Fo9kBvwDggZ_jD45Y_8DgljB39CoghB_qCw7evM4zHv-BwjlB3SwyR_YwnoBnGozpBgZgpmB4SgtQw3C4rzBoqD4jtB42Dg0oBwjM4q3DwwD4toBoxCo5hBgyBw3bw-Bg8uB4S43jBAoonB_Y4mpB3kCg_8CvMguX_Yw0fnGwieoG4iNwMgofwMo7Ww-B40nBojEo2-Bo4BwoW4oFoj2Bo4Bw9To8E45xB4rB4uWwlBgrb4SgsJ4S4lJwM4yZ_YgwlB3kCw8lB3rBo-S_qCowUnuG4nwBv_I4h4BvkToruD_2LgxlCv4Jwt5B_uF4shB_gH4_pB3lJw04B3zHosqBvMw3Cv7F4toB3kCopVnxC46f3Sg-K_YwsZvMwrSA4wLAw0Go4B4_pBw-B4gYw-BopVofgsJoxColSo4Bo2MwpEg5Z4kCwxKgkDgtQg9DosRwlBo1FwlBo1F4rB4hG4zHoghBwpEowU4kCgwMwpEwsZgyBw8M4kCgjVw-B45YofwsZoGoxbnGonHnfoiW_xB4qT_jD4oe_qCgtQ3kCg3L32D4qT32DozQ3zHg2d_xBo1FngIggZv0G44R_5HgxTnjE4sI_uF4wL_gHw1N_8DghH_uF4-JvmIgpNnrK4tPn-Swpdn8EwmI_uFw_IvjM4uW_rJo-Sv1No5hBnuGwkTnyJ4hfn8Ew9T3vEw2UvwDw9T39CwhXnqDwtgBn4Bo-SvlB40Ov0Gw_zCn4BggZ3rBosR3S4sI_xBwrS39Cgve3rBgxTn4B4xSnxC4qTvpE4uW39CgwM3vEgtQ3vE47Nn8EovN3oF4iNn1F4pM3lJosR3wLg4S_4Z40nB3wLwyR3vE46GvjMg4S_1dowtBviFwmI3lJwgQ_1EwmInrKw9T39C4hG_xBoqDv3CouG3lJ4nX_uFg0P_8D4pMvjM40nB39CwxKvwDo2MvmIo5hBvlBg2E32DgtQv0GgljB_Y4oF3oFgwlBnfo5I3Sw0GvlBglKvlBgiOnfooO_YgiO3SozQnG4-JoG4mQgZwxjB4rBorjBgZg7OgZwuOwwD44qBg2Ew-zBo4B4kb4S49bnGgiOvlBwhX_YgsJ_qCw9Tnf4hG32Dw2U3hG42cnnH4hf_nG4oen4BgsJ_8DwoWnjEgkc_qCwrSnjEg0oB_kKoi6DnjEw-zBnGgyBvM4oF_vM4s-E_Y4-J_YwjMnf4nX39C4xS_Yo5I_YohPvMgkDvlBwiF_YgrC_xBoqD_jDo8EnuGv_In8EnnHvpEv7FnqD3vEnxC_jDwMv3CnGnf_Y3rB4rB3vE49Cv0Go4B39CgrCvwDg9D_1E4vEv7FgyBn4Bg2Ev7FgyBv-BgkDvpEgZ_Y4hG36Gw3C_8DgkD_8D80D_1E8-DviF49C46G42D4zHoxCwpEoxCoqDo4B4kCg6H4lJ49CwwDwwDojEwiFouGgvFg6HwlBgrC4kCo8EwlBwpE4Sg9DoGg2EvlB4-Jn4B4zH32DokLvlBg9D_1Eg7OnqDoyJvMofnnHg8V_xB4vE_Y_Y_YvM3SAnfwM_xBw-B_qCnqD_8Dn1F32D_uFv3C_8Dv-B39C3kCnqD32D_uFnqDn8EvtHnrKvlB42DnGo8EgZgsJgyBgjVgZg0PgyBoyiBwMw1mBnG42DvlBgzI_YojE3kC4zHnxC46G39C4hG_nGw_Iv7FghH39C4vEvlBgrC_qConH3rB46GvMojEnGoqDoGojEgZouGo4B4zH4kCw7FgyBgkD49C4vEwiFg2EgrC4rBwiF4kCgvFwlBw_IwlB4lJo4BoqDgZgoGgrCo8EoxCg6Ho1FgvFgvF4kC49Cw7F46GoxCwwD4oF4sIgiOwzYo6PwsZ49Cg2EogI4wLg6Hg-KosR4uW4pM4tPg2Ew7F46Go5Ig3LwnPg6HwqLg3LgmRo1F4lJgvFgsJ4sIwnP4xS4plBgzI4xSo1FgpNg3Lwieg9DorKwxKwtgBw0Gw6Xw7F4uWwpEg_Rg2EgjVw3Cg7Oo1FgsiBgkD4uW4kC4jUgoGgxlCoxCo7WoxCg4SwwDg4Sg9D44RgZ49C4SgrCgyBw7FoqDg-K4zHggZgrCgoGw-BgvFw0GgtQ4hGgiOgvFo2MgkD4zHwpE43Kw-Bo1FgrCo1Fo1FooOgyBwwDo5Io3Tw-Bg2EouG4mQ49CghHglKotYgsJguXglKgyao1FgtQwpEovNg2EwyR42DozQ4kCg3L4kCo6Pofw4JwlBglK4SgsJwMowUA44RvlBosR3rB40O_xBw8M3vE4oenxCgtQvlBghHv-BwjM_jD4vd3Sw4JnfwnP3Sg0PAonHwlBwjlBo4BwsZgyBw8Mo8EgsiBwpE4qTojEwgQoqDg-KwwDorKwpEwqL4vE43Ko8Eg-K4uW48tBwtHwnP43Kg8VgrCo8EghH47No1Fg3LglKopVgkDgoGg3Lo_ZghH44RghH4qToqD4-Jo1F4jUw-B4sIg2EwhXouG4mpB4hGginBwMgkDgyBg-KoG4rBoG4rBoxCw1NwMw-Bw-Bw_I49C4-Jo4BgoG42DoyJ4kCo1FwtHooO4oFw4J4hGgsJojEo1Fw7F4zH42D4vEg6Hw4J4wL4iNwpEojE47Nw1NwlBofgzI4sI49C49CwiF4oFgwMwxK4_QwuOwxKw_Io4Bo4BwmIwmIouGghHwjMgiO4hGwtHwiFg6H49CwiFojE46G4zHw8Mg0Po0XouGwtH46GouG46G4hGgpNwqLgiO4wL4uW4mQ4tPwxKghH4vE4wL4zHghH4vE4kCgyBw7Fg9Do5Iw7Fg2EoqDo1FwpE49C4kCwnPg3Lw1NglKgyBwlBgyB4rBgZ4SgZ4S42Dw3Co8Eg9DwxK4zHovNglKwoW4tPwmIwmI46Gg6HwwDg2E4zHokL43K4mQw7FglK49C4oFg6HgsJonHgoGw-Bo4Bw3CoqD4kCg9DofoxC4S4kC4SojEvMouGnxCwqL3rBgkD32D4lJvwDo5IvwD4lJ39Cg6H3lJ4nX3zHgmRnjE4sIvlBw3CnuGooOn8EwmI30O4vdviFw4Jv-B42D3oFg3LvtHgiOnfoxCvmIg0PoxCojEo4B_qCojEvtHoxC3oFgZ_xBogI_zPwiFnyJoxCviFATw7F7pL49Cn1FghHnoO4wL35YojE_yIogIv5QwiF_5Hg9D36GwiFnkL49C3sIw3Cn2Mw3C_zPo1F_hOw3Cv0Gw0G_oNoqD3oFo5IvxKo1Fv7FwjM_9KooO3iNg3LnkLgiOn9LoqD_jD46Gv7FoxCn4B4oF_qCg9DvlBwwDAo4BwMoxC4rBojEgrCgsJg2EglKwiFoqDof4sIgrCg7OgkD4hGw-Bg3Lg9D4vE4rB4lJw3CojEwlBo8EgyBwtH4kCw7Fo4B4vEw-BgvFgkDw7FwwDwiFojEglKgzIwyRopVgnY4oewsZoxbwtHwtH4-JwmIorK46G4vEgrCwxjBwyRokLgvFg2EoqDgvFg9DojEoqDoqDgkD4vEwiF49Cg9D4hG4sIwiFg6HoxC4vEgzI4tPg9DghH4mQg2dgoGokLwwDgoGoqDo1Fg2EonHo1F4zHg9D4vEwiF4oFgsJg6HouG42DwiF4kCw7Fo4B4zHgyBw4Jo4B49Cw-BwwDgyBojEgyBo1Fg9DonHw_Io4BwwDw-BgoGw3CgwMgZwtHwlBogIvMwqLnG4toBoG49C4SonHvM4_QnGogIvMw4JvMo6P3S4tPnG4sI_Y4gY3rBw5pB3rBolrBv-B4qsB_qC47_B_1Ew60E_xB47mBnfg-jB_xBwksBn4B4mpBvlBgtQnfwuO3rBgpNn8EwjlBnjEgnYv0Go5hBnjEgmR_8DwuOn1FgjVngIo_Z3wLongB_5HgjV_qbgw-B_vMwien4BoqD3-JoiW3nXoq1B__Yw73B32DogI_kKwzYv_I4jU36G47N_hO4ra_rJg0P33Kg0PnuG4sI_9KgpNvwDwpEv7F4hG_rJgsJ_zPooO_2LwmInjEw3CnjEoxC_rJgoG3mQ4lJvrSokL_5H4vE3pMw_I_uFwpEnjEoqD_5Hw0GnrK43KnoOo6P3pM4mQv3CwwD_8D4oF30OopV_uF4sI_uF4sI33Kw5Q36GwxKv7Fw_I33K4_Q3rB4kC32Do1Fn6PotY_8DouGnjEw0GvpEgoG30OwoWv4Jg7On5I4iNviFwtHvwDgvF3wLg_R3kCoqD3vEghH_rJwuO3lJg7O_yI47Nn5hBww1B36GokLn8Eo5I3rBgrCv-BojEnfw-Bn9LgnY39C4hGvtHwrS3zHgjVv0G41VvmIgkcn4Bo5I_uFg2dn8Eoufv3CwzY39Cw_hB_Y45YnG4tPoGovNwlBw6wBgrCo56Bo4B4yyB4SguXwMwpdoGomZvMw6X3SgxTv3Cw04BvMwtH3Sg6H_xB4gYn8Ew-zB_jDgkc_jD4nXv3CozQnxCovN_jDwnP_jDgpN3vEwyRngIo4a3hGosRv7F4tPv4Jg1Wv7F4pM36GgpN_jDw7F_nG43KnuGorK36GorKn1FogI_9KooO36GwmIn5Iw4J3xS44Rn5IonHn8E42Dv_IouGvmIgvFvtHwpE3-JwiFnqco2Mn4a4wLvtgBg7O_riBg7Ov3CwlB3wkB4mQviF4kC_7VgsJ_0Ww4JngIgkD_yIwwDv_IojE3-J4vE35Y43K_oN4hG3_Q4zH3vEw-Bv7FoxC39C4rBn1FoxCv0G49Cn9Lw7F36GojEn5I4oFn5Io1FvmIgoGnhPgpN3oFg2E3sIo5Iv_IgsJnrKgpNvtHgsJviFghH_hO4jU_6Og8V_1E4vEv7FonHn1Fg6H_jD4vE_9Ko6P_9jBo13BvyRoqc_jDoqD32DgkDnxCo4BvlBwMv3CoG_xB3S_xBnfnxC_qC_xBv3Cnf_qCvlB_8DvM3kCnGviFwM32DgZ32Dof39CgZ_xBgrCnqD4kCv-BwwD3rBofA4kC4So4BwlBw-Bw-Bg2EouGoqD4zH4vE4wLwtHgxT4mQ4qsBg3L4hf4hGohPg9DwxKgsJ4nXwwDogI4vEghHg9DorK43KgkcwxKoxbojEg-Kw3ConHg2EgwMgtpBgzsD44Ro0wBojEo9LwiFgtQg2E4mQg2EosRg9Do6PgzI40nB49C4mQ49Cg_R49CopVw3Cw6XwlBwqLof43Ko4Bw-a4SovN4SgwMoGo1FoGgvF4SwkTwMouGgyBw-zB4rB44qBoGouGoGgoGoGw0GoGouGwlBw0fofgrb4Sg3L4SozQoGwtH4S44RwlBongBwM4iNgZg2d4Sg4So4B48tBw3CwksBg9D4yyBoxCgkc4vEg4rBgiOw_lEgZwmIwpE44qBorKg_8C4vEg0oB4shB475JonHw73BgzI4v2Bw0G47mBg2EomZgzIozpBw4JozpBgtQwugCwqLwnoB46Gw6X40Ow9sB40Og_qBwnoB47xDolrBot8DgxTgv3Bw-BwiFwhX4miC42D43Ko4ao4sCg6gB4x9CohPgxsBw_hBwohDg5ZgupCwpEo9L4sIwzYg_Rw-zBwyR45xBgkDgsJwrSgk1Bw1NginBwjMw_hBgkD4sI4vEgpNwqLw_hBo1Fg0PogIwoWgtQw2tBorKw7ew-Bo1FgkDwmIg6H48UogIo3TouGohPonH4mQw4Jw2UokLoiWgvForK43KgxTgzI40OokLolSo1FgzI46GwxK42D4oFo9Lw5Q4iNgmRoyJo9LwtHgsJwsZ49bgyBgyBwpE4vEo8EgvFo1FwtHoqD42D4wL4pMwuOohPgtpBo3sBg_R4jUw8Mg7O40OgtQonHogIwlaoxbg1W4gY42Dg9Dg9DwpEw4iBgpmBgsJglKokLo9L42DojE4lJwxKorKokLwlBwlBgZgZ4lJ4-J48Uo7Wg_R4qTouGg6H40Og0PonHogI40nB44qBw2Ug1WgsJglKgiO40O4xSg_RwuOo2Mg_R40OwtHo1F40OorKw1Nw_Io-SwqL4i4C4yyB4vd4_QohoBwhXwiegmRw7FoqDwoWw8MglKo1FgvFw3C40OogIwzYwuOozQw_IgiOogIw6Xg7Og3Lw0Gg3LwtHwkTo2Mw_hB45Yw8MglKowUgmRolSwgQwj3CwwuCokkBoghB4jtBohoBgnxB4jtBg3L43KovmBw4iB43KorK4sI4sIwiFwiFo7W4gYgp_BwklC4nwBox0BowUwoWg7OozQguXoxb4-J4pMgtQopV4lJ4pMw2Ug9c4k0BoquC4tP4nXoyiBw-zBo2MwkToiW4shB4xSw-aongBo-rBw9lC48_C4iNolSo_ZwxjBo4BoxCo1FogIowUgkcw7FogIg3L4_QwuO4uWg_R4kbwoWw_hB43Ko6PwtHg-KwgQotY4qT4oew-B49CwieowtBwtHwjMgxTwwcg-Kw5Qo1FgzIwsZ4imBouG4-JoxCg9Dw7e4uvBgoGgsJwvVongBo3T4oewwcwrrB46fwhwBosR4kbwuOopVgnY4-iBgkcw8lBw6Xg2d40OosRovNohPo4awwcooOo6PwhwBgyzBotYoqcowUomZw5Qg8VwrSggZg4Sw-a41uBowmCgpN4jUg9Dw7F46GokLwwD4hG46Go9L42DonH4sIozQgoGgwMwiF43KgyBg9DglKgnY4vE4wLouG44R49C4lJo8EwnPonHotYg-KginB4oFwkTogIwwc4kCwtHgvFgxTw7FowUg_RwnhCw0GwlaogIorjBgzI4jtBgrC47NwiFoyiB42Dw3b42DorjB43Kgx3D49C49boqDoxbwiFoonBw3CwkTwtgBg46GgwM46xCwpEggZ4vEguXgvF4yZgoGo4aw0GwsZghHomZghH4nXg6Ho0XgvFg0PgzIo0XojEglKg2dggrC4uvBgx3DgzIg8VwnP4plB4tPorjBgkD46G4vEoyJg6HwyRgqUwgpB4tPwpd40Oo4agiOgnY4oFgsJoyJg0PgwMgjV4_QojdopVg-jBg2EogI4wLo3Tw3Co8EwnPo_ZgyBoxCoqDo1Fo9L4jUomZwrrBwhpCwh7Dg7nB44jCwznGwn0K4gY4toBw-sCoujE4wLo3T47N4yZ4-JgxTouGgpNw0GwuO4pMoqcw_IwoW4hGwgQg6H41V4lJ4kbghHo7WojEooOgvFgxTgvFopV42c415DouGoxb4rBgvFw_I4imBw-B4sIw-B4sIo4Bg6HgsJ40nB4tPg0hC4zHwtgB4kCw_Iw-BoyJgzIo9kBoxCorKwlB4oF49Cw8Mw4JohoBw_Io2lBgyBw0GoyJ4toBg7Ogp_BwtHgvewmI4oeo5Ig2do8Eg7O4lJ4kbw0GwrSw7Fg7OogIw9T4lJwoW40OgsiBw8lBo92CwpE4-J4vEokLw0Gg0PooOw0foqD4zHg_qBotjDg6rDgg6HgxlCokhF4mpBgq_C4xS44qBw8Mo8dohoBg_8CgljB46xC4-Jo7WouGohPw5Qw1mBooOoghB4mQoonBwqLg9cwwDw_IouG4_Qg_RwsyBgpNg7nBgwMg7nBg0Pww1Box0B478F4zHgrbg9D47NoqDo9LwuOo4zBgiOwlzBgxT4jmCogIojdo4B4hGwuOo4zBw3CglKw-BonH4lJghgBouGwhXw-BonHw4J4-iBgkDg-KgzIo1egnYov4C46f4ixD4kCg6HoqDw8MgyBo1FgwMw9sBwuOgr0BgqUo7oCwlBwpE4zH4kb4kCg6HwwD4pMgsiBgu7Dw0GguXogIg2dwzYov4C4rBwiF46G4gYgsJw4iB4hGwvVonH4yZ4xrB468E4xSwgiCgyaoihDghH4yZg0P4h4BooOgyzB40Oox0B42DovN4oFwkToqDwjM4SgrC46GguXghHo4aojEwuOgpNo7vBwM4rBgyBo1FwlBojEgvFgxTw-BghHw-BghHw_IongB4shB415DgkcwllD4lJ4zgBgkDg3Lw7FopVgvFgxTw-B46GoqDg3LgwMgqtBw7FwvV4kbw6iDgyB4hGgkD4wL4rBo1FoqDgiOgkDo2M49C40Ow3C40Oo8E4vd42D4vdgrCwoW4kCo8d4rB4vdorKgjhK4vEo2pE42D4n7DwlBgwlBgyBolrBwM4pMwlB4shBoGogIofgljBwMwjMgyB4uvBwMg3LgrCg1oCgyBo6oB4So_Z4So-SoG4oF4So3T4rBg1vBwMooO4SoiWoG4zHof42cwM4iN4rB4mpB4oF4rwFgZ42cwMw4JgyBw6wBgZw-agZw3bofoufo4BosqBgZo_ZwMglKof42cwMo2M4SosRoG4-JwM47N4SosRwMwnPofw6X4SguXwMgzIw-Bwq9B4Swie4rBwgpBwM4sI4Sw2UwlBo5hBofg2dwlBw_hBgZosRgZgwlBoGw_I_Y42cnf4gY_YovN_xBo3T39Cw0f_qC41VnqD43jBvlB4wL_8Dw4iB3oFwzxBvlBwqLvlBwqLngIo_rCvMgoGvMojEnGw-Bn4B42cvMw1N3S4uWoGg5ZwM48UwlBoiWwlBohP4rBosRoqDw0foGgyBwiFgnxBwlBokLgvFw-zB4vEolrBgiOgpqEg8V4swG4zHoioCgkDoqcwlBorK49C42couGwj-B47NoglEwmIg9uColSoprFofglKoxC45Yg2Eg4rBoxComZgZonH4vEg7nBw3CggZ4vEomyBojEw8lBo1F4rzBwlBokL4rBooOwlBwjMw-BwrSgZghHoxC41Vw0G4i_BoqDgof4kC4oewMo1FoGgkD4rBowUoxCwgpBofwnP4SoyJw-BwtgBoGg2Eo4BwlawwDgz6B4kCg2dgyBoqcofg3LogI42gE4kCoghBgZg0PwM4tPA46GnG4sIvlBo7W_qCoiWn4Bo9L3vEw7en4B43K_xBw_I3S42DvlBonH32DggZvlBwtHnfghHv-Bw4J36GoivBv3Cw9Tnf4pMvM4xSgZ4pM4S4hGo4BwjMoxCw8Mg2E4mQw3CwtHg9D4lJg9Dg6HwpEwtH42DgvFg9DwiFg9D4vEo1Fo1FonHo1F4oFoqD4oFw3Cw-BgZgkDwlBghHo4Bw3CwMwtHoGw4JvMwtHvMw4J3S4hGA4sI4SouGwlBwxKgrCw7FgyBg-Ko8Eg2E4kCgqUgsJwnPw0GwrSogIg2Ew-BwtH42Dg9Dw-Bo1Fw3C4wLg2EowU4lJg5yBg1W4lJwpEgrCof4vE4kCo8Ew-BoxCwlBouGw3Cw1N4oFglKojEwiFo4BgqUgoG4zgBgzIwlaw7Fo1FgyBo6zDgkc4pMoxC4_Q4vEwoWgvForjB4sIo2MgkD4sI4kCg6Hw-Bo3To8EgtQg2Eg2EgyBg0Po1F4pMwiFgnYwqLouGw3Cwwcg7OoufwnPgwMouGooO46GwjMg2EorKgkDo1FofgvFofw4JgZg6HA4sIvMwtHnf4zHn4BgmRn1Fw_InqDg4rB3tPokkB_oNw7iE31uBwjMvwD4wL39C4lJ_xB4ranqD4pMnfgwM3rB44R_xBotY_qC4xS3rB45YnxCgwMn4BorK_xBw1N_jDoqc_5HwuOvpEoyiBv4J421B_zPorKnqDwqL_jDginBnkLo0X36GghHn4B46Gv-BozpB_9K4zH3kCwmIv-Bw8M39C4sIn4Bw7e36Go9L_qCwtgB36Gg3Lv3Co8Enf4jU3vEg8uB_kKwiFnf4oFnf4SAorKn4BwjMv-Bw_I_YwmIAw7FAgyBoGojEAgrCoGwlBoGwlBoG4pMoxCouG4kCgzI42DgzIojEo5Io8EwtHg2Ew7FojEwmI46GgiOwqL4-iBg9cg_qBg-jBw-BgyB4kCo4BojEwwD4zHghHg2Eg9Do2MwxKo6Pw8MgzIonHozQ47N43K4sIo5IghHwmhBwwcg2Eg9Dg6Hw0GgmqBorjBw9TozQwnPo2Mw7FwpEwtHw7Fw3Co4B43KghHw7FoqDo1FoxC4oFgrCg2Eo4B4oFw-B4vEwlBovN4rBo1FoG40OAw0G_YgsJ_xBw0G_xBghH3kCo5InqDwiF_qCw3CvlBg6HnjEw1NngI4-J3hG4sI3oFo9L3zH48UvuO4_Qn9LggZn-SwxKv_Io3TnsR49bntYgxT_-RgrC3kCwiFn8Ew4J3lJozQvnPw7Fv7FonHv0GgzI_5H4xSnzQwxK_rJ4nXv2UwmI_gHolSn6Pg1Wn3TgZ3SwuO3pM4vEnqD43K36G4zHnqDghH_qC4vE_Yw0G3Sg9DAgoG4S4vEofoyJg9DgwMo1FwtH42DwiFoqDw3Co4Bw7Fg9DgiO4lJojEg9D46Gw0Gw_IgzI42DwwD44qBwunB49CoxCojEwwDwlBofghH4hGoxCgrCw4J4lJ4kC4kCgkD49C4sIogI4zHgoG4zHouGg3L4sIg6Hg2E4zHw7F4hGo8Eo8Eg9Dg2Eg9DwiFojEoxC4kCo8EojEg-K4sI4hGwpEo4Bofo1F49CouGnqD4kC_qCw-Bv3C4sInwUgvFv8MofnxC4lJniWgoG3_QwMvlB42DnvNwwD30Oo8E3nXoxC_vMgyBnuG49Cv1Ng2E3qTo4B_gHwwD33Kw-B36GorK_jc49CngIojEvqL4vE3pMgoGv5Qw3CnnHw3C_5Hof_qCwlBnqDgZ3kCvM39C4SnjEofv3CgyBnxCoqD3vEoqD32DooO3wLojE32Dg2En1FgkDviFw3Cn1FgyBnjEg6HvpdgZ32DgZ3hGvMnkL3rBv5Q3SvqLgZnpV4S3pMoGvgQnG_wTwM3vEoxC4So4BAwwDoGgkDo4B4kC4S4_QwpE4oFgZgvFnGwwDvMgrC_YwwDnfojE_xBg3L_1EwtH_jDofghH4rB4sIgyBo2MgZ4oFofgsJwMg2EwM4vEoGwlBoGgkDoxCowUwlBokLgZ4pMoGorKof4qToGgrCoGg9D39CgyBnxC39CvlBv-BvpEvxK3rBviF_Y_uFnB3hB",
          transport: {
            mode: "busRapid",
            name: "FlixBus N1386",
            category: "Coach Service",
            color: "#73D700",
            textColor: "#FFFFFF",
            headsign: "Bialystok, Bus Station",
            shortName: "FlixBus N1386",
            longName: "Bialystok - Hamburg - Rotterdam",
          },
          agency: {
            id: "65528_ba99721",
            name: "FlixBus",
            website: "https://global.flixbus.com",
          },
          attributions: [
            {
              id: "d2a3dda55cb717c0cc9a9d085a4e6870",
              href: "https://flixbus.com",
              text: "Information for public transit provided by FlixMobility GmbH",
              type: "disclaimer",
            },
          ],
        },
        {
          id: "R0-S4",
          type: "transit",
          departure: {
            time: "2025-09-30T17:50:00+02:00",
            place: {
              name: "Hamburg central bus station",
              type: "station",
              location: {
                lat: 53.551767,
                lng: 10.011657,
              },
              id: "65528_716",
              code: "HH",
            },
          },
          arrival: {
            time: "2025-09-30T23:30:00+02:00",
            place: {
              name: "Copenhagen Busterminal",
              type: "station",
              location: {
                lat: 55.66449,
                lng: 12.56091,
              },
              id: "65528_6763",
              code: "KHG",
            },
          },
          polyline:
            "BH4mrt9for0--F_E_mEoG_1E4rBvtHgkD3-JgyBvwDw-BnqDgyB_YwlBokLgZ4pMoGorKof4qToGgrCoGg9DoG4sIwwDvMw-BvMgzI3kCw7FvlB4oFw-Bw-Bofw-B4rBw3CoxC49CwpEgyB49C46G4tPgvF4pM4hGgpNwwDg6H4rBw3Cw-Bg2Eo1FgwM46GooOgyBoqDoqD4sIgvF4pMgvF4wLwwDonHo4Bo4BojEw4Jo5IwkTw-B4hGgrC4hGo4BgoGo4BwtH_qCg6H_jDo1Fn8EglK32Dw0G_xBw3C3kC42Dn1FglKnjEojEnxCg9Dv3C4vE3hGoyJnxC42DAg9DoG4hGgrC4-JoxCwmIw3CwqLoyJ4_pBoxCo2MoqDwgQouGgrbo8E4jUojEohPw-BghHo4Bo8EoxC4zHojE4wLo4BwiFgrCgoG4rB42D49CghHw-Bg2EoxCw7Fw3Cg2EonH4wLgvFoyJwwDgzIw3Co5I49CokL4rB4zHgZojEgyBg6HoxCo0XgZw7FgyBwgQo4B4_QgZwuOwM4lJnG46G3rBgyanGwiF3SwjMvM4zHvMwtHnfg5ZnGojE_Y4xSvMw7FvMouGvlBgvev-B4xrBngIg7gC3rB43KvMwwDv3Co4anqD4yZ_Y4hG3kCg0PnfogI3So1FnGwlBnforKv-BwgQnxCgwMvlB4oFv3ConH3SgyBv-BgvF39CwMv-Bofv-BgyBn4BgrC3rBw3Cnf49C_YwwDvM42D4SwtHgZoqD4rB49Cw-BoqDwwDw3Cw-BgZ49CoGofnGgkDoxCo4Bw-Bo8EonHw_Ig7OonHovNw7Fo9Lg2EwxKwiFo2M49Co5IwwDovN4kCglKwlB46GoxCozQgrCg_RghHw04B42D4oeoxCojdojEg8uBgkD4plBw-BoiWgZwmIgoGgmjCgvFw9sBw6Xog3F49Co0X4rBohPw-Bg4SwpEgxsB4-Jo1pDwlBo2M49C4oeoxCgrbgyBgtQojEosqBwiF4s6BgZgwMof4tP4SolSAo2MA4zHvMg6gB3SgiOnfg_Rn4B4jUnjE4imBv3CgqU3zHgxsB3rBw0GnGofnGgZv0Go1e_rJo6oB3zHgzhB_oNg65BnkLo7vBv3Cg-Kv-BgzIvtHwwc3Sw-Bn4Bo1FvnPwlzB3kCwtH_qCoyJvlBwpE3oFolS_8D40OnxCwqL_xB4sInxCwyRnfgzI3S4-JnG4pMoGw5QgyB42cwwDgv3Bw0G4ixD4rBohP4kCwnPoxC4tPo4B4hGg9Dw2UojE4xSw3CokLwwDooO4rBo8EwiFg_RwiFg0P4hGo-SwmI4uWw0GgmRojEorKorK4uWg7Oojdw8M4uWgiOoiWwxK4tPw7FwtHo1FwtHg3LgiOgtQwkTo99BopnC4oFouGg2E4oFoxC49Co1Fw0GwuOw5QwjMooO4vdgzhBojEg2EgkD42D4ragvew_IorKopVwzYw77Eo8zFw2tBw30Bon5BgtiCgv3BgigCgvFgoG4shBw1mBo6PwyRo9L4pMwjM4wL4pMwxK44R4iNoqDgrC4_Q43KgmR4lJw8Mw7F4iNwiFo4zBo6Pw0G4kCw6X4hG42c4lJguXouGggZonHo5Iw3CokLoqDwyRwpEo1F4rBwwDofwpE4rBofoGwiFw-BozQw0Gw1N4hGgvFgkDgzIgvFg-Kg6H40Oo9Lg7O47NorKg-Kw_I43Kg2E4hGolSwsZ41VongBo0XoyiBwsZw8lB4hfw2tBouG4lJgjV46f45Y4wkB4qToqcg5ZovmBooO48U4pMolSonHwxK4hGw_IolSw-ao5I47NgrCojEogIg7Ow0Go2MogIozQwqLgrb49CghHg2EgpNgkDglKgrCghH4vEg7OorKwjlBg9D47NwpEwgQoyJ4-iBw7FwvVw-BghH4-JokkBgzIo8do1FwyRojE4wLgrCo1FgrCw7FgiOongBoqDghHgZgyBouG4pMwiFo5I43Kw5Qw7Fo5IgiOo3TolSggZongBg_qB41Vg9cgtQ48U4liBgqtBo2Mw5Q40OolSwqLw8Mg4SwkTo5IwmIojEoqDwmIghHgzIw0G45YosR47NgsJ4sIo1F41VwgQgg9Dgw3CwlawrSw5pBo8dgnYosRgupCo4zBwx8BgmqB4jUgiOgigC4qsBwxKonHgvewvVwjlB4raorjBomZgofoiWw6Xw5Qof4Sg1oCwlzBwnPorKgiOwmIonHwpEwnhCgwlBo13BongBwlsCgxsBw4Jw7FwpEoxCw4JgoGwjMwtHg8Vo2MomZg7OonHwpEoyJgvFwgQgsJwmIwiFgvF42Dg6HgvFgsJ46GouGw7F42c45YwMwMo8EwpEonH4hGg6Hw0Go1Fo8EwuOw8M4sIonHwwDoqDo8EwpE4tPgwMw7FwiF4kb4gYo3TosRg4SozQ4_QohPwl7Hwo-GwzxBwrrBogzC4npCog6BgyzBg0PwuO4wLokLokL4wLg-Ko9L4_Q4jUgyzBgp_Bw3CoqDg9Dg2E4shBw5pB4hGwtHo6oBwzxBo0Xwpdg_RwvVwrkCoy0C46GgsJgxT4vdwpEghHgvFgsJ4mpB4yrCg5ZgjuBgtQo8dw2UwunBo0Xg_qB42DghHw9T4wkBgiO4rawxKg4Sg-Kw2Uo8EgsJoiWoonB43K4xSg9DouGo1FgzI4mQw6XojE4hGgtQg8V4hG4zHwpdgpmBoqDg9D49Cg9DonHo5Ig6HwxKwpEw7FoxCgkDwuOgxTouG4sI4liBo-rBoxC49C4rBw-Bw0GgsJ4kC49Co1FonHw7FonHgkDojE46GgzIgoGogIokLwuOo3T4yZg7Ow2UgzIgpN4sI47NwmIwuO4mQo1eotYguwBginB4rsCwm6B40yD4wLg1WwuOwwcwwD46GgxTw8lBwpEo5IozQ4zgBw0GgpN4nXw2tBg9DwtHwqLg1W4sIgtQwgQw7eouG4pMoyJgtQo1FoyJgvFg6Ho8EghHw0GgsJ4pMw5Qwwc4imB4iNosRovN44R4tPgjVg3LozQwyRo_ZgpNwvV4wL4jUw8Mo0Xg6H4tP4hGw8MgpNo8dohP4plBonHo3T4lJ4kbgzI42coqDwjMwwD4iN4kC4sIg2Eo-SwtHgzhB4hGo1e42D4uWwiF4-iBgkDgyawlBwjMwwDovmBofolSo4B41uBoGglKof48tBwMw3bwlBgylDA4oFA4-J4So_ZAogI4Sw6XwMg8VoGogIofgh5BwMg8VoGg_RoGo2MA4kbwM42cwM4uWwlBwjlBofwgQgyBg_Rg9D47mBwwD45Yg9DwsZg2EomZg9DozQouGw6XwqLginB4vE47N4jUw47BgkDoyJ4uWo6hC4oeoh6Co6PwksBwxKoqcgiOgsiBo3TowtBo9Lo_ZgpN4kbo0XgjuBwovB4m7CwnoB49tCw2U4mpBw0Go2MgtQoghBgpNgrbovNwpdwvVg1vBw5QokkBgwMo4aoxCo1F4sI4xSg9Dw_IgpNwpdw2UowtBgvFwjM49C4hG4vEorKw7Fw8MwxK4nXo3T4_pBwpEgsJwxjBoxtCoyJw2U4lJowUg2d40gColSwnoBgsJgjVw3Co1Fw_Ig4SwiFg-K46GooOwmhBopnCwuOghgBg3Lo_ZwmIo-S4tPw1mB43K49b49CghHojEorKwwD4lJw1NorjBgkDwtH49ConHo6P47mBwuOgwlBg9D4-JwpEwxKwmIgqUwpE43K4_Qw5pBw8Mw0fghH4_Q4-JguX4-iBonyCgyB42Dw-Bg2E4_QohoBg9Dw_Io4BojEg9DoyJ4_iCog-Eg9Do5I4lJwvV4uWw30Bo3TgjuB46Gg0PwvVg8uBg9D4zHw4JwyRo1F4-JwqL4xSoxCwwDw-BgkDgkDg2EghHgtQgrCghHw3CorKwiFo4a4S4oFnGo1FvMw3C_qCw0G_1Ew0Gv-BgrCvwDg9D3vEwpE3kCo4Bv7Fo8E3pM4-J3-JgzInyJg2EnxCwM39CvM3kC_YnqD39CnuGvuOviFnkLvlBv3C_jD_gH3rB_jD3kCn8En4BnjEv3C3hG_2Lg-K36GouGn8Eg2E3vEg9D_qCgrC_YgZ3rB4rB3kCo4B3mQw1NnfgZnoOwjM_8Dw3CnjEojE_kKo9LvpEwiFvmIgwM39Cg2E39CwiF_8DgoGnxCg2E_1EogIvwDw7F_uF4sI3rB49Cn4BojE_nGgzI_5H43KngI37N_jD_uF3kC32D3kCn4Bv3CvM3rBoGnqD42Dv7F30OvlB_jDn8Ev1NvtH3SwM_5HvMviFnQ3kCoQ4kCwMwiFvMg6HwtH4So8Ew1NwlBgkDw7F40Oo8Ew8M4zHw9T4hGnuGwpEviFg6H33KgoG_yIoxCv3Cw3C32DwiF36GojEv0GojEnnH4hGnkLw3C3oFgvFv_IgvFngIoxC_jDg2E3hGghHvmI42D32DwwD_1EooOvjMof_Y4mQv1N4kCn4B4rB3rBgZ_YgrC_qC4vE_8Do8E_1E46GnuGg3L_9Kw3C4hGo4BojE4kCo8E4rBgkDgkDghHwlBw3CwiFokLouGwuOw-B42DoG4hGvMgrCA49CwMw-BgZgrC4rBgyBofgZofwM4rBAo4B_YwlB_xBgZ3kCwM_qCnGv3CoxCnjEgrCnxC42D_jDw4JngIooO_2L4sInnHw3Cv3CwiFn1F4rB_xBw7F3zHw7F32DgoGnqDg9Dn4BghHnqDoxCnfgkD3Sg9DnGwwDwM42Dofg9DgyB4zHg9D4oFwpE4lJonH4zH4oFwmIw7Fo5Io1FgmRg-K4mpBwlaozQorK4oeo-S45Yg0Pw2U4iNg_RokLorK46G4zHgvFwxKw_IogIwtH4zHogIo1FghHo2MwyRwlBw-BokLozQwwDgvFg1WorjBw1NopVoxCojEw4JwuO4_Q4rao8EwtH4sIg3L4-Jo2M4hGghH4sI4lJg6Hg6Ho8EwpEo7WopVonH4zH4-Jg3L4oFw0GwpE4hG4sIovNw7FokLoxCo8Eo4B42DogIg_RwpEwqL4-JwwcwpEwuOwwDo9LojEo9Lo1Fg0Pg2E43K4sIolSwrSg6gBo8EgzIo5I40O4zHooOgoGgwMghHohPwiF4iNgZ4kCgZw-BwxKgzhBojEg0PwiF41VgyBwmIwlBwiF46Go9kBojEg1WgyB4lJojEgxT49C4tPoqD44RogIolrB4SwwDgvFwsZgvFoiWgZgkDgvFwyRg9D4wLo8EgwM42DgzIouG47NoxC4oFg2E4sIgyBw3Cg6HwjMoxC42Dg9D4hGgkDwpEw3CojEo1F46Gg2Eo8EoxC49CgvFo1FgyBgyBouGw7Fg6H4hGwqLg6H4sIwiFgyBofgzI42DgkD4rBg6Hw3C4rB4S49CofouG4kCw5QwiFouGo4B4nXwtHw4JwwDglKojEg0PwtH4iN4zHgoG42DwnPwxKwqLw_IogIghHwwD49CgzIogI49C49CgqUwoWw4J4wLg-K47NonHoyJw8MolSgzIg3L4jUwiegwMo-SgnY4wkBwqLgtQw3CojEwuOgqU4kC49CgkDojEwtHw4JgiOosR47NwgQ4_QgmRgvFwiFg6H46GoyJg6HwxKogIgvF42DorKw0G43K4hGw0GoqD4lJg2E4wL4oFo8EgyBw-B4Sw9T4oFo2MgrC47NgyB4hG4S49CoGwlBAoiWvlBwiFvMgkD3SgqU32DwqL39Cg3LnjEo2M_uFw7Fv3Co1F39Co4B_Y49C_xBw8MvtHg-KvtH43K_5HwuOvqLwqLnyJ4tP37NgnY_tXwtgBvmhBwiFn8Ew3bv3bg7O37Ng7O3iNw8M_9KwxKvmIonH_uFg_Rn2M4lJv7FwrS33KouGnqDo9L_nGwhX_kKgiO3oF47N_1E4xSviFovN_jDo7W32D4lJnfw1Nnfo7WvM44RgZo1FwMo-Sw-BguXgkDgo4Bw_Iw8lBwiFg4SgyBguXgZw_hB3Sw9T3kCohP3kC40OnxCotY_uFo8E3rBwuO32D42DvlBw9T3hGg0P_uF4wL_8DwhX3sIonHnxCwsZ_rJgkDvlB46GnxC4tP_uFw5Q_nGwwDnfw6X_gH4lJv3CovN3vE4ra3hG42D_YoqDvMgpN3kCgmR3kC4iN3rB4tP3Sg7OAwuO4S40OwlB4qTgrCo8EgZw1NoxCozQ42Dw5QojE4wLgkDg65Bo6P4hGgyBgpNoqDooOwwDw3bgvForKgyBoxCoGw3CoG4mQgyB44RofwmIoGgwMvMw5QvlB4vEnGw8M3rBg0P_qCw-BvMgrCvMw4Jn4Bo5Iv-Bg4S_1EwtHv-BgnY36G42DnfwgpBv8MosR_uFwmI3kCwgQnjE4lJ_qC4pMv3Cw8M3kCo2Mn4Bg8V_xBo5IvMg-KAwjMgZ47N4rBozQw3CoxCoGwpEgZgzIw-B4-JoxCgiOwpEooOo8EgiOo1FgoG49C47Nw0G47NwtHo1FoqDgvFgkDg_RwjMwyR4iNo-Sg7OwwDgkDo5IwmIgrC4kCgrC4kCw0GouG4oF4oFw8MgpNwhX4kb4-J4iN4sIg-KwiFghHg9D4oFgtQw6XwtHo9L4pMwkTg2dwhwB41VwxjBg_R42cgwMg4S46GorKo9L4_Qo5Io9Lo6PowUwqLw1NonHgzI4zHo5I4sIgsJw7FouGwpEg2EgoGghH4vEg9DwuOw1Ng_RwgQw1NwqL4xSooOg0PwqLwjMogIgtQ4-JoqDo4B4lJgvFwiFw3C40OwtH4jUgsJouGw3C42c4pMwkTg6HwjMo8Eo6P46Gw2UoyJwoWwqLwkTg-KohP4-J4oFg9Dw8M4-JgoGo8Ew0G4hGonHgoGw1Nw8MwpEg2Ew3C49C47NwnPw_IokLw0GwmI4wLohPohPgjVomZoyiBwwDwiFgrC49CwgQwkTo1Fw0GgrCw3Cg2EgvFosRwrSgxTgxTwwDgkDw7F4oF4_QgiOg3LgsJ4sIgoGghHwiFo6PwxKozQ4-JgmR4lJw8M4hGwkT4sIoqcglKw8MwpE49bwmIwpEwlBoxCgZ49bg6HginBg3LgqUw0Gw2Ug6HwnPgoGwnPonHg7O4zHwuO4sIgsJw7FwrSgwMovN4-J4lJonHgzIonHw8M4wLw5QgtQgtQ4xSwqL4tPwtHokLghHwjM42D46Go8E4lJg9DgzIwmIo3TwiFw1N43KorjBoyJo2lBw0Go1e49C4tPw0GovmBg9DgrbgrCosRgZgvFg9Dg2dgyBg3LgvF4uvBgoG4s6B4So1FwMwwDwMwwDof4zH4vEwunBgyBwqLojEwwcojEomZoxC4iNgyB4sI4vEopVwlBgoGoyJosqBw-B46G4-J4shB4vEo2MglKo4a42DgsJgrC4hGgoGgiOw0GwnPwiForKg6HohP43KgxT4wL4qTw-B49C4zH4wLgiOgxTg7Oo-S4zHw_IolSw9Tw4J4-JwmIogIw5QwnPgzIwtHg2d45YojEw3Co2MgsJo1ewvVwzxBwtgBg3kBotYo7W4mQovN4-Jw_IghHgljBwie4iNwjMw_I4lJ41V4uWwwDg9DwkT48Uo-S4gYopV49bgiOgxTw8Mo-SwwD4oFw_Iw8M4wLg_Rw_IgiOowU4zgBw-agxsBw3mDwvrF4-iBw_6BwxjBw_6Bgkco3sB48Uw7ew8Mg_RokLg7OwqL40OgsJ4wL41VomZ4kCoxCgyBo4BgzI4lJ40OohPgqU4jUowU4xSgjVgmRgya4jUokLg6H4mQorKg3LonHglKo1FgxTwxKg7OonHo6PonHoqcg-KwnoBgwM4v2BooOo9sH4s6Bw5QwpE4shB4sIg_R4vEo4BwMoqDgZo9Lw3Cg9conHgnY4hG47N42Dw7e4zHg1W4vEo-SoqD41VgkDgzIwMo1FoGgvFoGo-rBvlBgkDvMo8EvMowUnqDwuO39CogI3kC4wLvwD4iN3vEg7O_uFg_R3zHgwMn1ForKviFgtQv_IgoGvwDg6H3vEgqU_2LgtQvxKo5I3oFo8d3jUgupC_4yBw1Nv_Io6PnkLo1F_8D4tP_rJw3C_xB42D3kCg6gB3xS4ra37N42Dv-Bw4J_uFw5Q_5HgzI32DgtQ3hGouG_qCguXngIo2MvwDgyav0G4xSvwDooO_qCgxT3kCg2dv-Bw9TnGg7OwMwsZgyB4yZoqD4pMw-BopVwpEo5hBw_Io9Lg9D49CgZg2d43K4pM42DgwM49CgwMgZ4hG3SgoG3SwmIv-BwmI_jDwqL36Go5I3hGwgQ_hOo8En8E42DvwD4kCv-BolS_lR4pM_9KolS_hOooO3-JogI_1E4kC3rBwqLnuGgmRvmIgmqBnlSglKn8E46GnqD4zHvpEwnP3lJ42D_qCgoG_8Do9LnyJooO_2Loqc3nXorK3sIwyR30OgwM_kKwtHnuGovNnkL46Gn1Fw7en4ao5I_5HwwD_jD46Gn1FgrCn4B4lJvtHgvFvpEosR_hO4-J3sIouG3oF49C_qCgZ3SolS3pMo8E39CwpEv-Bo5I_8DwpE_xBojEvlB42D_YglKnfoqDAwtH4SogI4rBglKgrCgoGoxCglK4oFoyJw0GgoG4oFo1FgvFw0GonHojEo8EojE4oF4zHg3Lo8EwmIgrCo8EgoGovNo8E4wLwiFg0PgkDorKoxC4lJg2Eg4Sw0GojdorKopuBw0Gg2dghHg2doxCwxKo5IgwlBwM49CwlBw7F4rB4hG49C47NouGwwcgoG4kboqDwuOwpE4_QgzIwpdojEw8Mw3Cg6H4kCw7FwiFwuOwxKgrbg6Hg_Ro2MgkcorKoiWgyBwwDw3CgoGghHooOorKg8VouGw8Mg2EgzI4oFo5I43KohPgoGogIo1FghHg2EgvF4qT4qTg-K4wLw-Bo4Bw1Nw1No8Eo8EgvFgvFwxKorKokLorKooOg7OoxC49CwlBgyB43K47Nw7F4sIwwD4oFogIwuOogI4mQgvFgwMoyJguX46Go6PghH4tP4vEo5IokLgqUopV4-iBohPwsZg3Lo-Sg9D46GgyBoxCgrC42Do4B49Cg8VwjlBozQgyaorKg0Pw_IwxKw7FgvFwwDoqD4-JwmIg-KogI4rBgZgvFgkDw7FoxCw0GoxCgsJoxC46GwlBg3Lo4B4vE4S4tP4kCogI4rBo1FwlB46Go4B46GoxCwwDgyBw0GoqDwwD4kCouGwpEwiF42DwxKo5I4hG4hGg0PohPwmI4sIovNw4Jo1Fg2Ew7FgvFwqLg-KwkTwkT4hfoufghgBwtgBo8EwiF4i_B47_BggyBwsyBgkDgkDwxKg-K4-Jw4Jg2EwiFwrSolSgxTw9TgqtBw2tBogIogIg9DwpEgtQw5Q43jBg-jBoufghgBwxKwxKwwDwwDgoGgoG4oF4hGojEwpEgkDoqD4hGouGwxKwxKg6HgzIw_IokLgzIg3Lw7F4lJ4vE4zH4rB4kCgrC42D4kCojEonH47NghHozQoqDo5IoqD43KwiFg_RgyB4zHoqD4_Q4kCo6PgyB4iNgyBwzY4SwnPoG4pMAw7FAg6HnGonH_xBwmhBnxCgwlBvMogI3SgvF3rBwyRvMwiFnfw4J39Co8dviFw8-BvMg2Enf47Nv-Bo8dvM4lJnqDoq1Bn4B46f3kCg22BnGoqDnf49b3Sw1N_Yo5hBoG4iNAgtQwMgjVgyBo7W4rBwrS4rBo2M4SouG49CwoWo4Bg-KgkDg4SwwD4jUo8Ew3bgZo8EwlB4sIgyBo9LgyBgwM4kC48UwlBo6PgZwjM4Sw_IwMghHwlB48U4S4-JoxCw6wBofwrSofo-SwlBg6Hofo0XwMgzIgZ4lJoqDg8uBgZgzIgyBw5QojE4plBgZ4oFw-Bw1NoxCwrS4rBgzI4oF4zgB42Do3To4B4lJw0G4hf4vEwkTgoGggZw-BghH4wL44qBwyRg39Bo1Fg4S4_Qgl8B40Ow73BgyBw7Fo8EgjVw-BwmIo2Moj2Bgve4zkEo3To5zCgzIgljBohPg-8BgmRwnhC4zH49bwmIwwcglK4shB40OopuBoxC4zHojEwjMgoG44R4-J49bw4Jw-agyBwwDgzIgjVgyBojEwiFwjMghHw5QwpEorKw_I4jUogI4_Qw7Fo9L43KwvVgwM4nXoqDgoG4sIg7OorKosRohP4gYg_Rwlaw9TgyaglK4iNwmI4lJg6Ho5Iw4JwxKg-K4wLokLg-Ko6PwuOgwMwxKorKwmIo8E4vEghHo1FwuO4-JojE49CwyR4pM47mBo_Z4sIo1FgoGojEwwDgrCgs7Bw1mB4l7BovmB4tPglK4sIgvFo5Io1F46G4vEgmRg-Kg2EgkDghgBw2UgoGojEwmI4oFg5Zw5Q46f48Uo_ZwyR4pMgzIorK4zHg1WgmRgpN43Ko9kBongBwhXopVwgQg0PwgQ4mQwyRwrSo3T41VooOwgQ4zHw_Ig2E4oF4lJg-Ko1F46GgyB4kC49CwwDo2Mw5Qo-SggZ4oFwmIo9LosR4-J4tPwqLwrSo-SongB4wLowUgwMguXwgQgofg7Oo8dolkCgirEg3L4gYoxCo1FosRgljBo-SginBgsiB4jmC4xSwjlB4sI4mQw8Mo0X4kbwhwBo1Fw4JgkDo1Fw0Gg3LgtQwieonHwuOwmIgtQ4zHg0Po1F4pMwiFgwM4hGgpNwwDogI42D4sIoqD4sIonH4_Q4yZ438BorKguXgzI44R4tPgofgwMw6Xo9LgjVozQoqcolSg9coyJooOw9Twwc47Ng4S41Vo4agtQwkTwqLo2MggZo_ZgtQo6PonHw0Gw1Ng3Lg8VolSg65B48tBw0jEgvpD4nwBo2lBw0Go1FojE42Dw1Ng-K46Go1FwuOg3LwhXosRglKwmIoonBgofw2UwgQwqLgzIg1WosRgqUg0PggZwkT4oe4gYohPo9LonH4oFgiOw4JojEw-BgoGgkD4pM4oFwwD4rBgrC4SoxCgZolSo1FwnPw7F4vEw-B4hGgkD4hGwwD49C4rB49Cw3CgkD4kC4pM4lJoqDw3Cw4Jw0GwwDgrCghHo1FgvFgkDwM4oFwlB4vEwlBw3CgyBoxCgkDwwDgoGojE4mQgsJw-BgZ4rBAwlBnfgrCvwDoqDwlBoxCo4Bo4BgyB4rBo4B4kCwwDgkDgkDgljBguXwwDoqDwpEw7FoqD4oF4kC49Cw-Bg9D4S4zHA4rBA4rBnGo1FgyBw3CgrCoqDgvFgvFw6X4jUoonBgsiBw2Uo3T4-J4lJ4zlkBg9ncg91Bo_ZwyRwuOgn3rBoy1iB4x9CgoxCo4zBopuBo5Iw_Iw_I43K4zHg-K4mQo5hB46GgwM4zHwqLooOgmRw0fwmhBoqDgkDo4Bw-BwlBgkDgsJwkT4hGohPgrCgvFw3Cg2Ew3CwpE4hGwxKglKolS42DwtHo8Eg-Kw-BojEofgyBojEgvF49C4vEogI4_QgkD4vEg9Do1FwtHozQ49CghHg6HwyR46GooOojE4zHg6Hw8Mg2EouGg9DgvFo1Fg6Hw2U49bo4ag3kBowUoqcouGw4JgsJohPg7Ow-a4-J4qTwgpBg9uCoiWolrBoj2Bg2oDo13BogsD4rao_yBozQongBggZg1vBwmIwuOg6Ho2M4zHokLogIg-KohPwrSg6Ho5I46GonHonH46GwmI4zHghHw7FginB4hfowtB43jB47xDg06C4-Jg6HohP4pM4pMoyJ4pM4-J4pMorKw8lBgzhBo2-Bwt5B474C4hxC4nXw2Ugkcg5ZosRg0P4gYgqUw5iC4v2BwkT4tPolS4tP40O4wLg3LgsJo8Eg9DogIw0G4iNwxK4liBoqcwwDw3CogIgoGwuOokL4iNoyJg-Kg6HorKghH42cg_RwxKgoGwjM46GgljBo-So6hCoyiBgjuBotYgxsB4gYwjMonHg-KwtH4-JonH4-JogIg-KoyJgwMo9LwxKokLglK4wLw4Jo9Lg7O4jUw0GoyJo_yBw-sCggyB4yrCwxK4tP43KwuOwxKw8MoyJ43Kw_I4lJw_IgzIo5Ig6HogIouGovN4-J4lJ4hGwxKgoGwxK4oF43Ko8EwxKg9DwjM42D46Go4Bo1F4rBwwD4S41V4kCo6oB4kCo1FwMouGwM4oFoGgzhBofw5Q4SwrSwlBgkcwlBovNgZglKofwqL4kC4pMgkDwuOwiFgpNw7F47N4zHovNo5Iw8M4-Jg3LglKwqLwqL4lJglK43Kw8MwqLg0P4sI4pM4zHgwMogIooO4zHg7OonHohPwiFg3LoyJw6XouGwrSg2EwuOonHo_Z41Vok2C4lJwqkBw7Fw6XonHgkcgyB4hG40O4z5B49Co9Lo5IwxjB49Cg-K4vEg_RgkDgwMwiF48UwuOw04BgwMggyBw0G4yZwmIwmhB4xSw6pCosqBwkpFohPohhCokLg22BoyJox0Bw0GginBo1F43jB4oFgpmBwqLoz7CopV4l4FgrCoiWo4BgxT4rBgjVgZgxToGolSnGwrS3S4tP_Yg7OvlBwgQ3rBohPnxCowUnxCozQ_jDwkTvwDwrSnjEwrS_1EwrS3-Jw4iBn4awq2C3-J4zgBnnHo4avwDwnP_nGwie_jDwyRnxCosRnxCgjV_YwmIvlBwqL_xBw9TvlBomZnGg0oBwM4_QofgqU4rBwrS4kCopVgkDggZ4xSgj5D4oFgzhBgpNwj3Cw0G4mpBw_hBwk7GgpNwq2CoqDo7WgkDgnYwpEg4rB4rBw9T4rBggZgZwkTwMg4SoGw2U3So9kB3So3T_qCginB3rB44R_-RogwGvwD4qsB3SglK3SgmRvM48UofwmhBw-BoufgyBgtQw3Co7Ww-B47N4oFojdwwDgtQ4rBw7F42DwnPwpEg0PwiF4_Qw7FolSghHo-Sg2Eo9LghHw5Qo1Fo9LglKgqUwwDonHo1FwjMogIozQ42Dg6Hw2Ug_qBogIwgQ44qB474CgmRgljBwrSokkBwyRwtgBo-S4shB4xSgofgiOg1Wg6gBggyBo3T49b4jU4kbgh5B4npCg4S45Y44RwzYg_RwsZo0XwxjB47N41Vo9LwkTwuOwzYwjMg8Vg-K41Vg-Kg1Wg0P43jB4zH4xS4sI41VwuOwgpBw4Jo1e4vEwnPwiF4xS4-Jw1mBgvFwhXorKwhwBo9Lw8-B4oFo8dorK4i_B4oFgljBwmIor8BojEoyiBogIgysCof43K4rBgpNonHw0xCgZwmIgZwmIwtH4hxC4vEg5yBg2EgyzBosRwygGwpEg1vBofglK4oFoy7BokLo07DgvFwm6Bw0Gwj-BonHwq9BgvFg7nBgvFo5hBgrCgiOw3CgtQo8E4yZwwDg4SoqD4mQwiFguXw0Gg2dofg2Eg7O40gC47N4p-BofwpEw-BgzIgwMg91B49CwjMojEwgQ4zHoqcwgQ421BgzIoxb4lJw3b4mQgqtBojEokL43KgkcgwMgvewjM49bgpN4vdw1Noxbg7Ogkc4rawksB49Co8E46GglKg6HokL4oFg6Ho1F4zHo2MozQg3LwuOgsJg-KgqUwoWowU48U43KwxK43KwxK41VoiWgjV4uW4jUo0XwxKovNgzIwqLwnPwvVwjMosRglK4mQonHwjMw0GokLg4SgzhBokLwhXouG4iN46G47Nw4JoiWwnPwqkBonHg4SovNo2lBg2Ew1NgsJgkc4wLo9kBowU4xkCgkDorKo7WwsrCwrrB41yEomZoy0C4sIgrb464Bgt_FgmRo13BgxTw_6B4hGw5Qw0GolSghHg_Rg0P4imB47Nw7e4-JgjVglKowUg7O49bg_RghgBwyRg9cwrS49bo9L4_Qo7Wo1ewrSwhXw2UguXwqL4pMozQgtQwxKg-KgwM4wLwvVg4So1ewhX4gYozQghHwpEgxTwjM4sIwiF4hxCwvuBwj3C4gxBolSglKg9DgrCwovBgrbwj3Cw6wBw-ag0P41V4iN4gYo6PwjM4sI41V4mQ4iNorKw4JwmIgljBwtgB4kbw3bw_hBw1mBgvFwtHgiO44RwhX4hfotY43jBo2MgqUgvF4lJgmRwpdgpNo0X40Ooxb4hG4pM49Co1Fg_qBwr9CgmRg3kB42Dg6H4mQoghBo1F43Kw3bwzxBg6HovNogIgpNgwM4qTo8EwtHgzIgpNg0Po0X4wLwyRwiFogI46GwxK45Yw8lBg8uBw9lCgy-Doz_FgsJ40O42DgvFg9D4hGouG4-JgiOgqUw3Cg9DghHwxKo5I4pMosRwoWosRwvVw0G4zH46G4zHg3LovNogIwmIonHwtH42Dg9Dg0P4tPwwDoqDo_ZwzY4wLwxK4yyB44qB4wkBoxbo9Lo5IoyJw0GwoWgiOgjVw1NotY40Oo5hBwrSwmIojEwuOghHwiFoxCwnPw0GonH49ConHoxCghHoxCgsJ49Co0XouG47Nw3C43Ko4B4iN4rBooOofgwMoGoyJoGosRnfooO3rBwxK_xBw1Nv3CgwM39CgwMvwDwjM_8DorK32DosR_gH4jUnyJw_I_1EgmRv4Jg3L3zHwtH3vEg-KnnHgi5C_v-BgljBvzYo8EnqD4_Qn9Lo4sCnj2BwwuCvw1BgvF32DokL36G4_QnrKw7e34R4qTnrK4xS_rJo-S_yIo7W_kKo7WnyJ4qTnnH4qTnuG47mB3wL4iNv3CwuOnxC4nX_qCw1NvM44RwMwgQofw8MgyB4xSg9Dw1NwwD43KgkDg4Sw0GolSonHwhXokLo0wBotYonHoqD45YoyJ4lJgkDwkTo1Fw_I4kCgwMoxCo9LgyB48UgyBo-SoG41V3rBgsJ_YwjM_xBgxTnjE43KnxCwxKnqDwjMnjEwxK_8Dw_I32DoyJ3vEwqL_nGwnPngIwnPn5Iw5Q33Kg_R_vMwnP_9K47NnrKozQv1NgmRnhPwla__YwgQ3mQ4mQ_lR47N_zPwuO3_QwkTv6X4jU3yZo-SvzYwhX_8cozpBvhwBooOnhPo9LvjMomZv6XoyJ_yIguXn3TwgQn2MgqU30Og8VnhPgwMngIg7O_rJ4oe_3S42c_3SonH_1EgmR_vMgmRv8M4wkB_nfgpNn9Lg-KvxKguXntYorK3wLoyJ_kKwtHv_IgiO_lRo4av_hBg-jB3gxBw5QvoWwnPn-Sg7OnsRw9T31VozQ3_QwoWv2U4uW3xSwqLv_IwqL3sIgvF32DowUnvNg2EnqDg-Kv0Go2M_gH4nXvqL4tP36Gg5Z_kKopVnnHo4avmIwsZnuG40OnqDwkT32D40O_qCgkcvwDggZn4BojdvlBg6gBnGomyBwM4mQnGokL3SokL_YwnPn4Bw1Nn4BgiO_qC44RnjEoiWn1FwsyB_hO4iN_jDwjM_qCwgQ_qCw8MnfgmR3S46GAggZ4rB4pMwlBohPo4BoxCwM4zgBg2Eg6gBgoG4qTwpEozpBokLwoWghHo1eorKg9cokLosRghHgjVoyJ4xSgsJwvVwjMwuOo5I4tPwxKg3Lo5Ig1WolS4iNwqLo2Mo9L44Rg_RwnP4mQwjMgiOg7OwrSg3LohPopV4kb4qT4gYwqLovNokLo2MwqLg3Lo2Mg3LgqU4qTwgQovNgwMw4JovNoyJwjMogIo6Pw4JolSorK4tPg6H4lJwpEwtH49C4kCofg6H49CgsJgkDoqD4rB46G4kC4iNwpEghHo4Bg6Hw-BosRwwDo-SgrCgyag9Dg9co8EgoGwlBg7O49CwyRoqDgwMoxCg3LgkDosRwiFgjV46GwlagsJ4gYw4Jw5QwtHo9Lo1F4oeo6Poxb44RgiOglKg7OwjMw8MwqL4iNgwMo0Xw6X4mQwyRggZoqcoghBwqkBo2MgwM4iN4pMgwMg-K44RooOooOglKwuOoyJwuOgzIovNwtH47Nw0GwuOw0Goqcw4Jo6PwpE4wLgrCgtQw3CwgQo4Bo6PgZovNAohP_Y4-J_YwoWvwD4tPv3Co8vCvrSwjM3kCo9Ln4Bo6P_xBgpN3SgkcoG4mQw-Bo6Pw3Cw3CwMozQ42Dw2UgoG4tPgvFgqUw_IwrSgsJg0Pw_Iw1NgzIwp2BwqkB40OoyJ4pM4zH4tPo5IwgQ4sIovNouGguXglKwzYgsJgwMg9Do2MwwDwgQg9DwxKoxCwmhBghH48mCooOw4iBgzIo8d4sIo_Z4sIowUwtHgtpBgtQ4yZwqLguXokL4lJg2Eg-Ko1FowU4pMovNo5I4_QwjMovN4wLwqLwxK4pMo2Mg7OozQoyJ4wL4zHoyJo4B4kCogIw4Jw_Ig3LoyJw1N41VghgB4hfguwB4xS4kbojE4oFo1FouGgvFouGg2E4oF4nX45Y4pMg-Kw8MglKogIgvF4oFwwDgpNogIgpNouGgpNo1FgpN4vE47NwwDoqc4hGwnP49Co6Pg9Do6P4vEo6P4oFg0PgoGo8d47N40OogIwuOo5I47Nw_I47Nw4JolSw1NwrSwuOw1mBg6gB4oF4vEgoG4oFgupCwugCouGw7FginBgzhBo3T4mQw9TwgQgqU4tPowUwuO48UgiOopVgpN41VgwMoiWg3Lw9Tw4JotYg-K4uWw_Ig1WogI4uWonHwoW4hG4kbw0GwnPoqD42DgZg9Dofgk1B4wLgwlB4zH40nBoyJonHgrC48UouGolSw0GoyJ42DooOgoG47N46GorKo1F42cg_R40O4-Jg4rBghgBg2dw2UohPgsJw1NwtH4pMouG43Kg2EgtQw0Gw5Qo1F4uW46G4uWonHw5Q4hG4mQghH4mQwmIg0Pw4J4tP43Kg4Sg7OwgQg7OgiOwuO4tP4xSorK4iNwjMgmRo9LolS43KolSoyJ44Rw_I44RgzIolSgvFo2M4-JwzY49CogIwiFgiOghH48Uw0G41VwyRw1_Bw7FgqUojE4iN4vE4iN4vE4iNwiF4iNg6HwkT4sI4xSwxKwvV4_Qg2d4-JwnP4-JgiOorKgpN43KgwMokLwjM4wLwqLogIonHozQ4iNgzIw7Fw2UgwMo9L4hGg0PouGg7OouGwyRogIongBovN4toBwyRw7FoxCwgQ4zHgsJo8E46Gg9D4oew9Tg7O4wL43KgsJg6HgoGghHouG47N47NooOwnPohoBg1vBw1Nw5QowUotYwiFgvFwiF4hG47N4tPwxKwqL43K43Kg-KorKwqLglKg3LoyJwnPg3Lw9TgiOwwD4kCg2EgkD46GojEwxKw7Fojdg7OohPouG4uWwmIw0Gw-Bw_Iw-Bw4JoxCg-K4kC4iN4kC4pMgyBgwMwlBwyR4SouGwM4lJAgkDoGg0PwMwoWoGorjBofgtQoGwvVofgvFoGg3L4rBg3L4kCg3LoqD4xS46G4_QgzIw7FwwD4kCwlBgtQwxK4kbolSg5ZwnPgsJo8EoyJwiFgxTwmIw4Jg9DomZwtHwmIw-Bo3Tg9DwyRgrCgh5Bg2Eo6Pw-BopV4vEwxKgkDorK42DwxKwpEo1Fw3Cg7Og6Hg-K46GooO4-J4-J4zHgsJwmIgsJo5I4lJ4lJw_IoyJgzIorK4sI43K4mQ4uWg6HwqL4liBw-zBgiO48UokL4tPwxKw1N4mQg4SgvFouGgzIo5IoyJ4lJ43KgsJ4wLgsJgwMgsJo2M4sIgpNwtHovNghHg3LwiFw7FgrC4hG4kCg7O4vE4uoCosRokkBo5I4shBogIg9cghHo1eghHgveonHgnYgvF4wLw-BglK4rBg6HgZ4iN4SwqLoGo8EvM4tPvlB43K3rBg-Kn4B4zgB_5H4uW3vEw1Nv-B4hG_Yg3L3rBwwDnGokL_YgiOvMohPwMgwMwMgyBA4oFgZwwDwMgpNgyBwuO4kCw4Jw-B4-JgrC4jUgvFwnPo8EwnPo1Fw7eovN4vEgrCg9D4kCw_Io8EgwM46G4sIwiForKw0G48UwuOg_R47NgtQovNwoW4jUorK4-JwtHwtHg2EwiF4lJ4-J46GgzIwiFghHwmIo9L4hGorK4oFoyJgoGgwMw7Fw8M4-JwlaogI4raouGoqcoxC47NoxCg7Ow-BwgQgyBwyRojEoq1Bw3CgljBwwDo1eo4Bw1NoxC4mQgvFghgBoqDozQ42Dw5Q4vE4xSgoGo0Xg2EozQwiF4mQ43Koufo1FwnPwiFo2Mo8EwqLorKwoW4vEoyJw4Jo-S4vE4sIwtHo2M4sIw1No8EwtHw-BoqDwgQg1W4sIwxKwmIglKo5IglKgsJ4-JwqLwqLglKgsJgmRgiOg0Pg-Kw8Mg6HovNwtHorKwiFguwBwoWwnoBwrSgofooO4hfooOg7OghHw3C4rBgnY43KgtiCo1eosqBwzY4zHgvFonHo1Fg6HouG4sI4zHo2MwjMonHwtH46GwtHovNo6P4iN4_Qo2MolS4pMgxTouGg3Lo5IohP4-JwrSg9D46G49CwiFonH4pMg6H4pM4tP4uW43KgiOw4Jo9LgzIw4Jw_IoyJw_I4lJw_I4sIwjMwxKgoGg2EgwMw_Iw1Nw_Ig6Hg2EohPg6Hw9TgzIg3LojEwnPojEg6Ho4BonHwlBo0XoxCwgQw-B4zHwlB4sI4rBogIo4BogIgrCogIoxCogI49CogIgkDogIwwDo6PwmI4tP4lJ4zHwiFg8Vw5QghH4hGgiOovNwuOohP46Gg6HgpN4mQw8MgmRolSw3bwuO45Yo1FwxKo1FokLghHg7OwwDwtHw4Jg1WovNw4iBgkD4sIwlBgkD4hGwgQgzIwvVgoGooOouGgiO46GgiOonH47N4wLopVg3Lg4Sg-KgtQo9L4mQo9LohP47NwgQ4hGouGw_Io5IwpEwpEwmIonHwtHouG4zH4hGwmIgoG4zH4oFw5QwxK46Gg9D4oeg0PwjMw0Gw0G42DwwDw-BozQw4J43K46G4qTo2MovNoyJw7F4vEg5Zw9Tg-Kw_I4qTozQw4Jo5Io2Mo9Lo1FgvFw4Jw4JwtHwtHw4J4-Jo9Lw8MwkTwvVwiFw7Fw8M4tPwoWgkcokLwuOw8M44RwqL4mQgwM4xSo2M4qTgzIw1NosR42c4lJ4mQ46Go9LwlaoivBwvVo2lB4iNopVwuOo7W43K4mQw1Nw9To2Mg_R42DwiFg4SggZg7O4xSo6PwkTg6gBg7nBgiOwrSwpEgvFwxKooOojEo1FgjVwieojEouGw6Xw1mB47NwhXo9Lw2Ug0P49bo1FwxK4mQoufgjVg4rBw8MoqcoyJoiWwuOoyiBokLg9co5I4nX49CogI4-Jw3b4pM4wkB4iNgtpBwyRog6BgpNo6oBw_I4raw5QopuBo2MghgB4kC4oFgiO4liBgmRginBgsJo3Tg5Zw-zBo6PwtgBoxCo8Eo3TohoBgyBgkDopVwyqBw8Mo_Zo6Pw0f4vEg6Hg9DogIgrC4vEw3Cw7F40nB4vvCwvVo-rBw9T4xrB43K45Yg2EwqL40Og-jBooOgwlBo6Pw9sBg6HguXouGw9TwxKgsiBo1ew7pDoxCo5Io7WwwuCgvFg4So4BgoGwovBovjF4tPwp2Bw1N490Bw4J4mpBojE4xS43K4rzBg2E4gYwmIwvuBwiFwtgBouGo3sBo4Bo2MgrCg4S4kCg_RoxCo7WwpEwksBw3CgzhBgZ4sIgkDowtBo1Fw0qDoGwwD4lJ4guFofozQ4S43KgyBojdw7FgluDoxC4toBoG42D4vEg6yCoxCoivBgZ4qTo4Bg6gB4rBo1ewM4jUAoxbvMoyJn4Bo4a3rBgiOn4Bw1NnxCg0P_8D4jUnjEwyRnqDg3LnjE4iNnjEo9L_5Ho3T_yI4xS3vEo5I_8DghH_rJohP36GoyJ_uFonH32D4vE_kKwqL_hO47N_iVo-SnrKo5I33KogI37N4pM_1Eg9D32DgkD_pUgmR_lRo6P_yIgzIngIo5I_5HgsJ32DwiF_qC49C_uFogInyJohP_qCg2Ev_IosR_1EorKnjEw4JnxCouGnjE4wLnuGw9T32Dw1Nv3C4wLnxCo9L3vEotYnxCwkT3SghHv-B4nXnfg9cwMw2U4SohP4kCg2dgyB40OwqL4_7CwlBorKgyBw8Mw-BgxTw3C4imBwlBwpdoGg5Z_Yg4rBvlBo_Z_jDwvuBv-Bg2d_uF45qC_YoyJ_Y4wL3S4sI_sQw5xHv-BoxbvpEor8BvlB4_Q_qCg-jB39Cg_qB_qCgmqB_Yg4SvMo4aoGgxTAo1F4S4gYgrCoyiB4rBgwMgrCgmRw3Co6PwwDosRojEozQo8EgmRg9DwjMojEwqLojEwxKojEw4J4-Jw2UouG4wLwxKozQg6H43Kw0GogIgoGghHw_Iw_IooOo9LgjVwgQw1NglKgsiB4kb4-JwxKgpNovNgzI4lJgoG4zHouGw_I4hGorKwiFglKwjMgkc42DogIwpEg6Hg2E46GwiFw7FgvF4oF4-Jo5I4lJ4sI4qTosRw_Iw4Jw_IwqLw0GgsJo1FgzIo5IwuOo0XwyqBovNomZw3C4oFw7Fg3LonHo2MgsJgmRo6P42c4sIg0P42DonH40Ooxbg9DonHgrCgkDgsJ4mQ49CwpE49C42D42Dg9Do1FwpEw-BwlBgkD4rB42DwlBg9D4SwwDA42D3S42DvlBwwD_xB42D_qCg9DnqD42D_8DoqDnjEw-B_jDoxC3oFw3Cn5Iw-B3pMw3C_6O4rBnuGwlB3oFwlB_1E42Dv1NwiFn6PgkD3sIgZv-BgrC3hGgwM3vdwpE_rJ4oF_9KgrC3vEoqDv7Fg2E3zH46Gv4J49C32Do8En1FgwM3iNojEvpEoqDnqD46GnuGgrCn4B4hG32DwwDn4Bw-Bnf4oFnxCo1Fv3Cg_R3lJo1F_jDwnPngI47N3zHwwD_xBo8Ev-BgkD_xBo4B_YgvF3kCg9D_YgyBA49C4So4BgZ4kC4rB4zH46G4tP40OwpEojE4kCw-B4zHw0GgkDw3CgoGo1FojEojEwpEwpEg-Kg-KwpEo8EojEo1F42DghH4rBoqDgyBojEgrCwmI4kCo5Iw-Bw8MgyB4-J4SojEgvFw1mBwlBogI4sI4l7Bw7FgtpB4rBogIwlBo8E42Dg3L4vEw4JojE4hGghHghH4oFwwDwlBwM4kCofw-B4Sw7FgZgvFwMoyJwMw7F4So8EwlBojEgyBo1FwwDwwDw3CgZgZwwDn4BnGv3CwMn4BoxCn2M4zHonH4-Jw8M49C4S4vEnxCg6Hn1FgyB_YgZoGgZofo5IghgBgvFosRkpHggP",
          transport: {
            mode: "busRapid",
            name: "FlixBus N613",
            category: "Coach Service",
            color: "#73D700",
            textColor: "#FFFFFF",
            headsign: "Oslo (Busterminalen Galleriet)",
            shortName: "FlixBus N613",
            longName: "Oslo - Hamburg",
          },
          agency: {
            id: "65528_ba99721",
            name: "FlixBus",
            website: "https://global.flixbus.com",
          },
          attributions: [
            {
              id: "d2a3dda55cb717c0cc9a9d085a4e6870",
              href: "https://flixbus.com",
              text: "Information for public transit provided by FlixMobility GmbH",
              type: "disclaimer",
            },
          ],
        },
        {
          id: "R0-S5",
          type: "pedestrian",
          departure: {
            time: "2025-09-30T23:30:00+02:00",
            place: {
              name: "Copenhagen Busterminal",
              type: "station",
              location: {
                lat: 55.66449,
                lng: 12.56091,
              },
              id: "65528_6763",
              code: "KHG",
            },
          },
          arrival: {
            time: "2025-09-30T23:41:00+02:00",
            place: {
              name: "Havneholmen St. (Metro)",
              type: "station",
              location: {
                lat: 55.66091,
                lng: 12.559426,
              },
              id: "17355_22053",
            },
          },
          polyline:
            "BG-5vlqD470-XpX_vBvRz3BjcvmDvCjDvCT_EwC_YkSrOkIrJ7B7fnpBrYjXjI0oBnB0FU4IvC4NoL0yBjDoBjDkDvHoLrEsJzFwHnGwCzIiO",
          transport: {
            mode: "pedestrian",
          },
        },
        {
          id: "R0-S6",
          type: "transit",
          departure: {
            time: "2025-09-30T23:43:00+02:00",
            place: {
              name: "Havneholmen St. (Metro)",
              type: "station",
              location: {
                lat: 55.66091,
                lng: 12.559426,
              },
              id: "17355_22053",
            },
          },
          arrival: {
            time: "2025-09-30T23:47:00+02:00",
            place: {
              name: "Rådhuspladsen St. (Metro)",
              type: "station",
              location: {
                lat: 55.676373,
                lng: 12.568803,
              },
              id: "17355_78697",
            },
          },
          polyline:
            "BHwo30lhB4r1xvH87M_2Qw9JzzNk9HjkHg2J_-H43Fv_D42N71K05K3mL46LnkQ0kIj-Jw5GzuD45Jr-C4qJ4zC4uHkoFoqI8rK8iH0hMwsF8zLs-R4xmB46QwrmBsyI04X8tT8w3BooEsjNomF4yK4mGk4Hk3FwpE41G4_Bo0IgK46Vz6Cs4KwnFotO80SgyQg5Z",
          transport: {
            mode: "subway",
            name: "M4",
            category: "Subway, Metro",
            color: "#0299bb",
            headsign: "Orientkaj St. (Metro)",
            shortName: "M4",
          },
          agency: {
            id: "17355_156091e",
            name: "Metroselskabet",
            website: "https://m.dk",
          },
          attributions: [
            {
              id: "fd99ed0caca491face7b0a55acea971e",
              href: "http://www.rejseplanen.dk",
              text: "With the support of Rejseplanen",
              type: "disclaimer",
            },
          ],
        },
        {
          id: "R0-S7",
          type: "pedestrian",
          departure: {
            time: "2025-09-30T23:47:00+02:00",
            place: {
              name: "Rådhuspladsen St. (Metro)",
              type: "station",
              location: {
                lat: 55.676373,
                lng: 12.568803,
              },
              id: "17355_78697",
            },
          },
          arrival: {
            time: "2025-09-30T23:48:00+02:00",
            place: {
              type: "place",
              location: {
                lat: 55.676704,
                lng: 12.568478,
              },
            },
          },
          polyline: "BG2knmqDm4k_X-EtL4I3S",
          transport: {
            mode: "pedestrian",
          },
        },
      ],
    },
    {
      id: "R1",
      sections: [
        {
          id: "R1-S0",
          type: "pedestrian",
          departure: {
            time: "2025-09-30T14:49:00+02:00",
            place: {
              type: "place",
              location: {
                lat: 52.378909,
                lng: 4.900551,
              },
            },
          },
          arrival: {
            time: "2025-09-30T14:49:00+02:00",
            place: {
              name: "Amsterdam Centraal",
              type: "station",
              location: {
                lat: 52.37892,
                lng: 4.900889,
              },
              id: "21260_157177",
            },
          },
          polyline: "BG0v-8jDkyjrJqGwG",
          transport: {
            mode: "pedestrian",
          },
        },
        {
          id: "R1-S1",
          type: "transit",
          departure: {
            time: "2025-09-30T14:49:00+02:00",
            place: {
              name: "Amsterdam Centraal",
              type: "station",
              location: {
                lat: 52.37892,
                lng: 4.900889,
              },
              id: "21260_157177",
              platform: "7a",
            },
          },
          arrival: {
            time: "2025-09-30T14:54:00+02:00",
            place: {
              name: "Amsterdam Sloterdijk",
              type: "station",
              location: {
                lat: 52.388562,
                lng: 4.83716,
              },
              id: "21260_61838",
              platform: "3",
            },
          },
          polyline:
            "BHgruhnf8onv9Ck1pB_51D4ravzqC8rPv5kB4ooBz_oC0jLroX40nB3s2Ds7Qvz7Bg0FntsB4jFzxlCjhB37pM0zDzq6Cw5B_s0DAruZ",
          transport: {
            mode: "regionalTrain",
            name: "Intercity",
            category: "Rail",
            headsign: "Enkhuizen",
            shortName: "Intercity",
            longName: "Enkhuizen <-> Heerlen IC3900",
          },
          agency: {
            id: "21260_32b565d",
            name: "NS",
            website: "http://www.ns.nl",
          },
        },
        {
          id: "R1-S2",
          type: "pedestrian",
          departure: {
            time: "2025-09-30T14:54:00+02:00",
            place: {
              name: "Amsterdam Sloterdijk",
              type: "station",
              location: {
                lat: 52.388562,
                lng: 4.83716,
              },
              id: "21260_61838",
              platform: "3",
            },
          },
          arrival: {
            time: "2025-09-30T15:04:00+02:00",
            place: {
              name: "Amsterdam Sloterdijk",
              type: "station",
              location: {
                lat: 52.389758,
                lng: 4.838497,
              },
              id: "65528_2878",
              code: "AMD",
            },
          },
          polyline: "BHojunnfg5ro8CwrX0ja",
          notices: [
            {
              code: "simplePolyline",
            },
          ],
          spans: [
            {
              walkAttributes: ["indoor"],
            },
          ],
          transport: {
            mode: "pedestrian",
          },
        },
        {
          id: "R1-S3",
          type: "transit",
          departure: {
            time: "2025-09-30T15:10:00+02:00",
            place: {
              name: "Amsterdam Sloterdijk",
              type: "station",
              location: {
                lat: 52.389758,
                lng: 4.838497,
              },
              id: "65528_2878",
              code: "AMD",
            },
          },
          arrival: {
            time: "2025-09-30T20:10:00+02:00",
            place: {
              name: "Hanover central bus station",
              type: "station",
              location: {
                lat: 52.378922,
                lng: 9.740987,
              },
              id: "65528_733",
              code: "H",
            },
          },
          polyline:
            "BHgkmonfg8lp8CgFwnK3kCA_xB4rBnGwpEAw7FoGgqUAwwDAwwDwtHoGouGnGo8E3SoqDnGg9DnGonHvMwiFnGgyBAA4vEoGo1FoGwmI3SovNAwwDnGgwM3rBoG_5Hw-B3zHo4BvtHw3Cn8E4kC_gH49Cv0GgyBv_I4rBnjEgZv4Jw3C_qCoGnjEoG34RgZ3zHoG35YgyBnqDoGvlBAvlBoG_qCAn6PgZvxK4SviFwMv_IAniWgyBv7FoG3-JwMvtHAvtHvMv_I_xB3rBnG3oFvlB_nGn4BviFn4Bv8MviF_kKvpEv9T3sIvtH_jD36G39C37Nn1Fv4JnjE_5H39C3mQ_1En2MnxC36Gnfn5IvM_kKoG3pMvM33KoG3_pBwlBv1NwMnsR4Sn1FoGvhX4SnlS4S_4Z4S_-RwM_5H4S3mQwMn3TgZvgQoGn9LgZnrKAv2U4S_hO4S36fgZ3hGnGviFoGnvNwM_oNoGnqDnGnfnGnjEnG_YnG3oF3SvlBnG3rBvM3zHn4B_uF_xB_1E_xBn8Ev-B_3Sn5I_kK_1En1F_qCvlBvM_jDvlB3wLnqDn1FvlB_uF_Yn1F_Yv4JnGviFAvwDAnnH4SnnHwM3pMwlBviF3S32DAnnHvM3sI_Y3rBAnuGAvxKoGnxCoGnzQofnrKgZv0GgZnyJgyBv-BwM_1EofnvNg9Dv3CwlB3oF49CvpEo4B_8DoxCv-B4kC_qCgkD_qC4vE_nGw1N32Dg-Knf4oFvlBwtHnforKvM4iNAwxKwMwmIgZo9Lofw2UoGgkDwMglKgZ4wL4SgwMwlB4jU4rBgrb4SgwM4SwqLw3Cgk1BofgtQoGgrCoGwpEoG4vEwMonH4rBggZgkDgw-BwlBwhXgyBo5hBwlBomZgZgtQgZwrSoG4vEgZg0Po4Bo1eofwvVof41VwMohPgZ41uBAo8EA4tPAovN3S4nwBnf4_pB_YgpNvlB4pMn4BgpN_xB4lJv3Cw8Mv3CokLvwD4pMnuGolSn4B4vE3oFo9L_8DwmIn1Fg3LvlBgrCn4BwwD3kCwpE_xBgkDnxCwiFnqDghH_Y4rBvtHwnPnyJo3T3mQwmhB3hGwjMvgQongB3kCg9D3SofnjEwmIn4B42D36G47NvpEo5Iv-BojE_kKowU36GgiOviForKn8E4-JvwDg6HvwD4sI_8DgzIn1F47N_1EgpN3vEooO39CokL32D4mQ39C4mQ_jD4uW39Cg9cnfo9L_xBggZ3SgmRnGg7OwM4iNwMghHofgpNoxCgjVoxCg0PwwDw5QoqD4iN4zHo_ZwmIwlagyBo8E49Co5IwwDorKwtHopVoxConHg9Dg-Kofw3Cw-B4oF4kCo1F4hGgmR4zH4uWgkDglKgvFo6Po9L4liBwiFgiOwmIotYw3Cg6Hw0G4jU43K4hf42D43KoxConHoxCghHgrCw0GwxK4yZonH4_Qo8E4pMojEwqLg2EwuO4Sw-Bg9DgwMw3CwjMwMwlBofg2EwpEolSgkD40Og9DozQo8Eo3ToqD4pMw0Gg1W4kC46GoqDoyJwpEg-Kg2Eg-KojEgzIo1F43Kg2EogIgvFogIgZwlBglKovNg-K4pM47Nw1N4hGgvF4iNwjMwtHw0G4lJo5Io1FgvFw_IgzIw-Bw-B4gY4gYg9Dg9Dw-Bw-Bw7Fw4JonHw_Ig-KgwMwwDwwDg0Pg0Pw3Cw3C46GghHwiFouGgkDg2EoqDgoGo4BojEgkDgsJgyB46G4rB4lJwM4vEoGoyJnGg2Enfw_Iv3C4pMviFwnP_hOohoBn4Bo8EviFw1N3zHw2Uv_Iw6X30O4wkBnjEoyJ3kC4oF_jD4zHnxCw7Fv3C4hGvyRo2lB3vEo5I_uFgsJ_vM41V33KwgQ_oNg4SngI43K_1Ew7F32cw4iB36GgzI_oNwyRv-Bw3CvlBgyBnyJ47N3wL4_QnyJwgQnrKwrS3rBoxC3zHg7OnqDw0Gv_IosRv0GooO_xBw7FnfojE_Y4kC_5Ho3TnnHo3Tn5Iw3b_jD4lJ3zHg5ZvwDwjMvtH42c3kC4lJvpEgqU39CwnP3vEo4anqDo7W_8DgsiB3rBwyRvlBo-Snf45YvMw_hBnG40OwMoiWwM4zHAo0X4S4gYvMolrBAw0f_Ywla3rBghgB_Yg-K3rBgjV32DgpmB_xBw1N39Co0X3kC47N_uFoghBn4B46G3SoqD3oFwjlB39Cg4SnqDw9T_8DowUvMo4BvtHo6oB3oF42c_5Hg7nBv_Ig4rB_-Rg2vCvtHw0fv_I4wkB_vMg1vB3tP4z5B3lJongB3Sw-B_gH4nXngIoqc_xBgvFvtHw-an1Fg1Wn2Mgo4B3vEoiWvtHwgpB3kCgiO_5Hoq1B33KoihDvwDwwcnjE42c3oFoghBv7FwtgB3vEg1W_9Kg5yBvjMwhwBviFg4S3hG48U3_Qw73BnhPoq1BnhPo4zBnG49CnfojEv0G45Y_jD40OvwDg4Snf46Gv3Cw6Xv-BgqU39C45YvpEw3b_8D44RvlBg9D_vM4mpB3sIoiW3-J4uWvmIwgQnkLw2Uv9TorjB_1EojEn8Ew4JvpEw_I_8Do5IvlBoxC_yIgxTnjEgsJv3CghHn8Eo2MnkL4hf3sIwoW_5H41VnyJgya_1E47N_uF4qT_jDw8M39Cw8M_jDgmR3rBgsJ3kCw9T_xBo_ZnGosRwMg2doGgzIwM40OgyBo6hCgZg4rBofgpmB4S4kbofg4rBAgyB4rBgyzBoGohPA4nXnGgoGvMw4J3rBoiW3kCwhX_8DgvevwDopV39C40O32D4mQv7FwoWvpE40O_1EwuOn8E47N_5Ho3TviF4wLv4JowUvmIg0P3hGwxK_9KgmR_5HokLvjMg0P3sIw4Jn5IgsJv_Io5IvtH46G_5HghH3gYwvV_8DwwD32DoqD3yZwhXnjdo_Zn-Sw5Q3lJ4zHnyJwmI31VgxTv5QwnP3oFo8E_1Eg9DnyJg6H_1E42Dv0GwpEngIg2E3sIg9D_yIwwDn5Iw3C3kCwM_gH4rBvwDwM3oFgZnjEgZ_yI4S3zHwM3iNofvtHoGn3T4S3xSwMnrK4SviF4S_gH4rBv4Jw-Bn4B4S_5Hw3C3sIwwD_2L4hGnqDw-B_1EgkDn1FojEnnHo1FnkLglKnrKokL36G4sI3-JovNv3CwpEngI47Nn5IgtQ_ggB40gCv1Ng5Z3yyBw9-CviFoyJnqDgoGvxKw9TvxKo3T_gH4iNnhPoqcn1FwxKv7ForKngIgwM_8DgvFv0G4sInuGwtH_8DojE36GouGv-Bo4Bn5IonH33K4zHvtHojEv0GoqDvtH49CnjE4rB_2L49Cn5I4rBnjEoG321B_Y3iNwMnnHofn2MgkDvmI49CvmI42D_rJ4oF_u3B4shB_5Hg2E_9K46GvqL46Gn2M4zHvMoG3vEw3CnkL46GvtHo8E34R4iN_5Hw0GvpE42DnjEwwDnrKw4JnjEojEnnHonH3wL4pM3lJg-KvqL40O3mQwhXv_Iw1Nv7F4lJ3hGw4J_8DouG37No0X3wLgqUv0GwqL3-JosRnrKg_R36fo13BvjMwoW3sI4mQnyJ44RnxCo8EnoOo_Zv1NwhX_hO41V_gHorK_oNo-S3uW46fvwDo8EnjdozpB_8Do1FnvN4jUnrKozQnoOomZ_vM45Y_uFg3LvwDogIn1FovN3sIwvVviFgiOn8EwuOnnHguX_nGwhXvpEwyR32DgtQn8EgnYn1F4-iBn4BgwMnf4zH3rBwqL3rBohP3kCwwcnfg_RvlBwqkB3kC4xkCnG4hG_xBgpmBvMg7O_Ygyanf4hf_Y41V3SgxTvMo2M_qComrCvlBo1enfolSv-Bo4a_qCg5Z39Co_Z_qC4xS_8D4ranjEomZviFw-a_gHgsiB_jDooO32DwyR39C47N_2Lou4BvwDolSn8Eg8VnrKo7vBnjEg4S_qCg-Kv3Cw1NvwDgtQv3CwjMn4Bw_In4B4sI3kCw4J_jDwuO_uFomZ_xBg6H_xBghH3kCg-K_uF4kb_2Lwt5BvtHw8lB_kKg91BvnP4szCn8Eg9cviFg9c_rJ464BvtHozpB_uF4hf3hGw7evlBouGnnHgtpBvuOw3tC_jD4_Qv7FghgBnvNo0pCnfwiF_gHw1mB_8DgjVnqDolS33Kg65Bv-BwxK_8Dg8VvwD4qT3vEo_Z_qCgpN3kCwuO_xBo2MnqD4kbnfwmI_8D43jB36G438B36G4-7Bn8EozpB_jDw6Xv3Co-S3vEw3b_jD4_Q39Cg7OnqDg7O3sIgsiBnnHwlanjEw1NvtHguXvpE4pMnnHo3T_gHg_R3-JguXn1FgwMnqDghHn2M4yZ_gH4iN_vMg8V_2Lo-SnkLw5Qn2Mg4Sn8EghH_nGw_InqDg2EnkLwnP32D4oF_uFogInqc47mBn4a4plB_7Vo8d3rBw-Bv-BgkDn4BoxC3zHwxK3qT4kbnvNg4SnwUg9c_nGgzI3oFwtH_1EouGv_IgwMnoOowUnqDwpE_8Dw7FnxCoqD_mxBgmjCnhoBgr0B3oFghH_Yof_YwlBv3CgkDn5IgpNvwDgvF_sQ4nX_uFg6H_5HokL_8D4oF3qlC41gD3qTgkc_5Ho9L_1E4zHv0GokL_zP49bn2MotYvjM45YvjMg5ZnqDghH36GwuO_xBoqD_YgyBnrKg1Wvlaou4B33K4gYvtHg4SnuGolSnqDokL_jDg3LvlBo8E3vEo3TvlBouG3kCo2M_xBokL_xBw8M3rBgpNn4B4jU3rBwrSvxKw9wEvMg2EnGoqD_YorK3rBg4S3rBg4Sn8Ew5iC_kKw8pE3hGo1wCvwDw2tB3kC42c_Y4pM_YokLvpEog6B3wLog-EnfovNn4BotY3-Jg-nEvqL425E32Do_yB_xBo4a3rBg9c_Y4kbvMgrboGw3bgrCoz7Cw-Bgh5BwMglK4SgiOoxC4uvBo4Bgof4SogI4SgoG4rBgmRojEw1mB4oFolrBwpEoufgyBwqLojEgve49CgjVgyBglKgyBwjMgyB4wLw3CopVofgoG4sI4w9BouGwyqB4lJwgiC49C41VgZ4hG4oF47mB42D4hfogIwhpCwiFwlzBojE4nwBgZwxKgkD4mpB4S4sIgkD4uvBwMgoG4rBgkcoqD4vvCwlBo3sB4So5hBofg_8CwlBw-zBwM4mQwlBg4rBgkDw7wCoG46GgkDw8-B4SorKgyBgrb42Do56Bg2EoogCg2Eog6BoxCwwc49CongBwpEwrrB4-Jwy8Cg6H4thCglKo4sCoqDo0X42Dw6XgvFgofw7Fg9cojEwrSwpEwyRgyB4hGgyBw7F46GggZg6H4raw_IwwcoyiBgoqDwsyBgv7Egw3C4juIgzIgyaokL4liBgzIo4ag-jBg-uDoqDglKo6Po0wBwqLorjBouGopVoyJoghBo1FgqUwpE4_Qo5I43jBw7Fgyao5IwksBgZ4vEoqDolSwiFw7e4kCw1NwlB46GwwDo4a42DongB4kCg8V4rB4iNoxCgkc4S4zHgyBw2Ug9Dwt5B4sI42gEo5Iot8DwmIwmsDw_I43uDg9DopuB4pMohsEgyB4xS4rBo2Mo4B41V4kCg8V4rBo6PofgzI42D4imBw7For8BgzI4l0CgyBo6PgxT4o0F49CotY4zHwgiCouG464Bg6HohhC4kCg0P4rBokLoxC4uWonHon5Bw_Iw9lCw_Ig_jCgrCwgQo8Eo1e4oFgvew-BwxKo4BgsJw7Fo8dw7FoqcouG42cg0PgtiConHgzhBwwDg4SwpEw-agkDo_ZoxCoqc4rBo_ZwMokLoGowU3Sw6XvlBo0X_qCwwcnqD49b39Co-S_1EomZ_8Dg_R_8D4mQ_gHomZ3oF4_Q_yIgnY_nGwgQ36Go6P_kK41VnyJwrS30OwsZ3zHo2Mn5I47Nv_IooO_6gC4kmD3lJ40O3-Jo6PvqLwkT_gHgwM_jDw7F3lJ44Rv7F4pMn1FgwMvmIo3TnxCouGvpEwqL_yIotYvmIwsZvmIwwc_gHw-av0GwpdnjEgqU_8DwvVn8E4hfv3CowU_qC4jUn8Eoq1BnyJokoE36Gw57C3sIgylD37Noq5Ev-B48UnfglK_Y4zH_5Hw3tC36GwnhC_uFo_yBn1FggyB3hGw30BnrKg32C_8DongB_vM4niDv3CgqUn4Bw8Mv-B4tPnsR4r-D_1EwtgBnjEoqcv3C4xS34Ro33D3lJor8B_uFghgB39Co6P3vEgjVv7Fw6X_gHg5Z3zHotYn1F4mQv4J4kb_rJw6XvuOgpmB3oF40O_jDgzI_yIggZ_xBo8EvlBwwD_jDglK3vE4mQnuG4rangIgpmB3vEw-a3kCohPv3CwzY3kCo_ZvlBosRvM46GnGwiFvMg-K3SomZAwqLofw1mBgyBg9c49Co8dofogIwlBgzIoxCwyRwlB4zH4vEggZ49Cg7Ow0Goqco1FwvVo5Ig2do8EohPwpE4pMonHg4SwiFgwMw3CouGghH4mQgrCo1FoxCo1F4hGgpNgkDw0GwpE4lJgwMgyao2Mg9cgsJ4uWwtHo3To1FgtQogIo_Z4kC4zH49CorKgyB4hGogI4shBwjMg22Bw6XogsDwiFg1Ww-Bo5IgrCglKo4BogIojEwkTgvFwzYwtHgzhBw0Gg2dw-Bw_I47NoogCwmIo5hBo5I4zgBwiFw5Qw4JwieghHowUo1FwnP42D4-Jw-BwiFghHwyRg0P47mBohoBwhiDozQo6oB4iNghgBwlB49CoxCgoGw3C46Gw4Jo0X4kCwiF4rBoqDgvF47N4mQ40nBwpE43Kw-Bg2Eg3Lwwc45Y438BgkD4zHooO4wkBojE43KoqDoyJoxConHwpEgpNwmI4kboxC4lJo4Bw0G4kCwmI42DohPo4B4zH4oF4nXwlBo8EofwpEwlB4oFg-KwzxBgoGg2dgkDg7O4oFgnYwhXojoDwjMwi3B4sIgwlBgwMgk1BoghBoizEwnPwrkCoxCwqLg3Lw30Bo8EopVw7FwlagkD4iN4zHgvewwDooO4hGg1W4zH4rag9DgpNo8E4tP4sIomZohPgtpB4vEg3Lo8EgwMoxCouGw4J4nXohPokkBo8EokLo9L49bwtHwrSouGosRgvFwgQoqDokLg6Hg9c42Do6Pg2Eo0XojEwzYoxCw5QgyBorK4kCwnPgoGwgpBgoGo2lBw7FwieouGwwco4BonHoxCw_IgZ42Dg9Dg7O4hGopVouG48U46GgxTwiFgiO4pMwtgBwpE43K4hGohPgwMo1e4vEokLgvFovN4hGohP4vEokL4l7Bw2xEwzYok9BwjMgof49CogIogIo7WwxKo5hB4hGwoWo8EwrSghH49b4kC4lJo9LotxBojEgmRwvVwn6C4rBgoGghHojdojEosRgyBgoGg6Hg6gBg6HwmhBoqD47Nw3CwjM49C47N4oFo0X49C40OojEopVwwD48U4kCg7Oo4B4iN49Co4aofokLofwuOwlBwrSwMw7FwMghHofo6P4S4sI4rBg_R4rBw-agyBw0fo4BgsiBofooO4Sw4J4S4lJofwrSojE48mC4SwqL4kCo9kBwpEwugCwpEguwBwwDg0oBoqDwieg9Do2lBo4BohP4S4oF4rB4lJwMwwDo1Fw6wBwpEgqtB4rB47NgrCwsZw3Co5hBo4Bo7WgyBwvV4rBwzYgyBguXoxCg4rBofwoWwMogIw-B4gxBoG4zH4SwnPwMghHoqD438Bo4Bg2dw3CohoB4rBwyRgZgzIogIwg7Cg6Hg1oCgoG4k0Bw7FopuB48Uw1jF4hGg1vB49C4nX43KwmzC4hGwhwBoqDgkcwpEgtpBoxCgkc42Dw30BgyBgvegZ4xS4rB4z5BoG4-iBnG4shBnfw50DnG4uW3Sw6wBvM4t6CvMgv3BvMwzYnG4sInGwgQAggZnG4jUnGohoB3Sw83CAg_RofwzxB4rBwqkBwlBguXofg4S4kCgveg2Eoq1BojEozpBgvFo4zB4rBohPogIw3tCwxK4rlDg2EwovBgZg6HofgzIof4lJg9Dw5pBoxCorjBwlB44RgyBoxbo4Bw2tBgZwieoGg3kBvMo3sB3Sgrb_xBo6oB3rBoyiBvMorjBoGozpBwM4mQofotYw-BoghBg2Eoq1B4kC44R4hG4xrBwmIw-zB4vEo4awwDoiWw_Ioj2BgrCgiOgkDwkTgyBw4Jw3CwnPg3L4uoC46GwvuBoyJ4jmCgoG4k0BoxCotYgZ4zHgvFox0B4rB4iNwiF4v2BwtHogzCwlB4iN4sIw57Cw-Bg_RgrCwoWgrCgjV49C48Ug9DgnYwMoxCw0Gg3kB4oFg5ZwtHghgB4hGgnYw-B46G4sI4vd42D4pMgvFw5Q4hGg_Rw8MwxjBgvF40Oo4BwpEg9DoyJw4JguXwjM42cokLo_ZwjMgkcw0Gg0PonHgmRwpEo5I4hf4uoC4jUg1vBgsJg1Ww7FovNogIg4Sw-BojE4oF4wLonHw5Q41Vg5yBorKguXo1FgwMw5QwxjBw2Ug0oBwjMo7WgiOoxb46GgiOonHohPw1Ng2do2MwpdovNg6gBo4Bg9DwlBwwDooO4plBw1N47mBovNg0oBozQo13BgzI46fwpEw5QwqkBw5tE4gYgm8CorK47mBwqLgmqBglKw8lB4wL4_pBgvF4jUovN4gxBw7F41Vo1FwoWwiFopVojEwkTwlBw0Gofo8E4rBonHgkDwkTw3CwkT4kCg_RoxCw3bw-Bg9cgZg_RoGorKA4vdvlBgwlBv-B49bnxC49bnnHoogCvlBgwMnGo4Bv-BwrS_qC4vdn4Bg6gBvMoyJnGwoWwM4yZgZgjVwlBo7WwlBgtQoqDorjBgrCo7WgkDgsiBgZw4JwpEog6Bw-BoghBwlBggZo4B4k0Bofwi3BAo7WAomZAw4J3Swpd3SguXvM4mQnf4yZ3kCo6oBvwD4l7B_xBwgpBvM4qTvMwtgBoGotxBwM45Y4S4qToxCo13BwlB44Rg9DgyzB4hG438BouG4yyBghHg1vBw4Jgo4B46fookFgsJw6wB48Uo5sDg9cgk5E4iNg4kCoghBoxxFw0G4imBwkTo2wDg7O474CgzI4uvBghHoyiB4oFwzYojEosRouGggZw7F4uWgvF48UgoG41V4pMohoB4sIwsZ4-Joqco5I4gYw7F4tP4sI48UgzIw2UwjM49bwmIwrS4hGw8Mg0Pw0fwnPojdwsZwvuB4zH40OonH47No8E4-JghHwnPglKo7Ww0Go6Pw-Bo8Eo9Lgve4rBgoGw_Io_Z4vE4tPg2E4xSgrCokLw-Bg-K4kCgiOw-BwyRgZoyJofo-SoGw_InG44R3rBomZ3rB40Ov7FwlzBv-BovN_8D4uW_qCg-K_8Do6P_1EwgQ3vEgpN_nG4mQngI44RvlBoqDvlBgvF3iNw3b3vE4lJv0Gw1N3vEgsJ3mQwmhBv3CgvF_1Eo5IngIohPnhPo4avqLo-S_6Ow6XvyRgya_uF4sIvmIgwM_nGoyJvqLgmRvnPwhXn5IgpN_zPguXnkL4_Q3vEouG_uFwmIn9L44RvhXw4iB3kbwnoB_nGw4J_kKwnPvuOgjV32DgvF39bo6oB30Og1WnkL4xS_uFoyJ3oF4-J_uFokLvwD4zH36G4tPnuGg0Pn5Io0Xv7F4_QviFgmR_nG4nXvwDwuOn8E4uWnqD4xS_qCo6P3kColSn4BwrS3rB41V3SwyRnGogIA4wL4SopVwM46G4kCgrbgrC48UoqDwzYg9D4rawiFo8dgyBw_Iw3CohPwlBgvFgrCo9LgkDg7OgyB4zH4oFw6XoqDg7OgoG4oe42DwrSg2Eo7WwmI44qBgZojEw-Bg-KojEoiWgvFouf49CosRwwDg8V49C48UoxCg1W4kCggZ4rBw2UgZgtQ4So0XoGo8EnGojEAg2E_Ygof_Yg0PvlBgmRn4BgjV_YghHn8EgpmB_8D4nX3vE4nX_jDwuOnnHo8dn1F4jUnjEgpN_gHgjVvmI4uWngIgqU_wTwovBvkTo7vB3_QwksBnrK49bn9Lg6gBnxC46Gn4B4oF_hOg0oBn-Sog6B34Rog6B_gH4nXv_I4hfnqDo9LvlBwpE_1EosR_1Ew2Uv3Cw1N_1Ewwcv-Bw1N_xBgpNn4BgqUvlBw9T3SoiWAw9TgZotYwMw7FgyBgqUgyBohPw-Bo6PgkD48Ug9Dw2Uo1FomZo8EgxTo4BgoGwiF4mQojEo9LwmIwoWwuOo9kBo4B4vE46G44RgwMw0f4nX4l7BwwDw_Ig_Rw2tBwmIo-SgrC4oFgiOoufo2Mo_ZwxK48UouGwjM4-JolS44Rw7e4xSwieoyJg0Pg3LowU4hGokL4wLg1Wg-Ko0Xw7FovNg-K4kbonHo3T4lJw3bwmIw-awtH49bo8EowUg9DwyRwwD44RwpEo0Xw-Bo9Lw3C4xSg9Dg6gB49CwmhBgrC47mBgZwlaA4wLnGo4a_Y49bnf4xS_qCouf_qCguX_qCw9Tv-B47N_uFo5hB_qC4iNnjEw2Uv3Co2M3lJovmBnfojE3rBgvFnn5Bwy5GvtHojd3lJgpmB39CooO_xBogInjEguX3vEgve32D4liBn4BwhX_Yo6PnfwmhBA4lJAwtHAokL4So3TgZ4tPgyBguXgrCwzY42DwpdgkD48U42DgqUwpEopVgrCwxKorKgtpBg2E4_Q4iNgjuBotY4zyC42DwjMwsZgoxCo-S4z5BwuOwyqB4zHwoW4oFooO4oFgiOwtHg4Sw4J4uWg6HozQgvF43KwmIwnP4sI40Oo1F4lJ4lJooO4iNwkTw8lBo_yBw7FwmI4tPguXgzIwuO4hGg-K4wLoiW4wL45YgvFo2Mw7F40Oo8Eo2MwiFooOwpEw8M4hGo3T4zHw3b4zHwtgBwiFgyag2E4vd49CoiWgyBw1N4kCgnYgZglKwMogIof4qTwM4iNofo13BwlBo0wBgrCg8uBgyBgxTw3C4raoxCoiWoqDo0XgrCwuOgoGo5hBw_Io-rBo8Eg8VghHgljBw3CgiOgrCw1NgkDw9TgrCwyRgrCo3To4B4xSwlBohPgZgiOwlB4gY4SgmRoGg9DoGoqDoGgoGwM48Uw3Cw-sCwlB4kbw-B43jBo4BwhXo4BgqUgyBwgQwMwwD4kC4xS49CwvVg2Ew7egyBgsJo1F4liBghH4shBo8EgxTgkDo9Lo8E4xSogIgyag9D4iNw3Co5IwiFwgQwqLw0fw3C4zHgkDg6HosRosqBgjVgxsB47N4raggZ48tB4uWgpmB4pMgqUogI47N4_Qgkc43KwyRg3LowUgiOotY46GgpNojEogIg9DwtHg8VozpBwmIozQogIwyRgiOghgBw8M4oe4vEwqLoiWwt5BoyJ4kbohPwvuBwtH45Y4jUg8nCgoG45Yw4JozpB4hGgkcojEowUo4BwmIwwDo-SwmIoivB4oFoyiBgkDwoWw3Cg8Vo4BooOw7Fo82Bw-B41VoxCo9kB49Co-rB4S4iNw-BwjlB4S4tP4Sg3L49C4ykDgZ4-7BgyB4l0CgrCwg7CwlB4zgBgyBwtgBgkDwp2Bg9D490B49Cg-jBoxCw-a4oF4v2BwmIg_jCofogIgrC44RoqDomZ4kCgiOojEg2d46GgjuBg2E4zgBg2Eg9coqDo7WwmIomyBglK40gConHgqtBw7Fg7nBgyBw4Jo4Bw8Mg9DwsZ4wLgs0CojEghgBwpEoonB46Gov_Bo4BgqUw-BomZoqDwjlBoqDo4zBw-BwovBgZo_Z4rBg-jB4Sg-KgZwvnCAwmhBnGg6gBnxCwpoDnfwla3vE49mDvtH4v6E_5H43gF_xBo9kB32Do1wC_Yg4SvlB4shB39C4l7B3rBguXnfguX3kC45xBvlBw2U_xB45Y3rB4uWnxC4zgBnqDw_hB3vEg7nB3zHg1oC3oF4k0BvlBwjM3rBovN32DgqtBnfwuOn4BwsZvpEok2Cv-BwzxBvlBopV3kCwxjB_8DotxBv-BowUvtHo6hC3oF4plBngIgk1Bv_Iw04BnjE49bn8Eg3kBn1Fw5pB3kCwkTv-Bw2U_jDg7nBn4BorjB_YgrbAw_I4SgyawlBw_hBgrCw0fwlB4_QoxC49boxCgjV4lJ438Bw-B4wLw7Fw7e47N4_iCo5Iw8lBglKo-rBonHg2douGwzYw0fg59Dg6HwtgBgkDw1Ng-KomyBwMo4BghHgljBoxC47NgkD44RgrCgpNgkDgxT4vEw-aoqDw3bwlB4sIg2Ew1mBoqD4zgBg2Ew-zBgyBw2Uo4BwjlBgyBgpmBgZ4yZoGg8VwMg0oB3S48tB_Yw6X3rBwjlBn4Bo9kBnfwnP3hGg6yC3oFgh5BvtHgl8Bv-Bw5Qn8EoyiB3oFgljBnjEw6Xv3Cw5Q_kKwp2B_jDohPv7FgnYnuGwla_1E4_Q_gH4uWn6PwvuBn1FwuO_8D4-Jv0G4tP33KwhX_gHwuOvuO49bn9Lw2U3wLwrSv_I4iNnkLwnPn6Pw2UvkTo7WvuOo6P_iVgjV_twB4yyB_pUguXvqLgiOnwUg9cv0G4-Jv0GglKvxKgmRvmIooOvuO4kb_jD4hG3oF43KnnHwuO_nGgwM_wTwrrB_8D4lJ_8DoyJnnH4_Q_qCo1F_kK4yZvjM46fnqDoyJ33KgvevtHwvV31V48mCnyJgljBnkLgjuB_rJg0oB_qC4-J_vM4l7B_oN44jC3sIg0oBvxKg5yBvmIoyiBvqLgjuB_jDg3LvwD47N_5H49bvuOw-zB_oN4qsBv_Iw3bnyJ42cvyRomyB3wLgofnvNw4iBn-SowtBv0GgtQ3kCwiFn4B4vE_lRoonB_-Ro6oBviF4wLnyJ41Vn4Bg9D_xBwwDvsZg65B_xB42DvtHozQv0GwgQnxCw7FvwDogInhP4wkBnrKwsZn9LghgB31Vwj-B3pM4imBn1e4niDv6Xw3tC_yIw7enlSw2mC3lJgtpB32DozQ36Go5hB_5H44qB36GolrB_1E4zgB_1Ew8lB_uF45xB3vEww1B3SghH39C48tBvlB49b_jDo3sBvlBgve_Y4iNv-Bg7nB3rBotY32Dg0hCn4BwienjEw47B_8DowtBv3Cgve_nGg39B3pMwuyDnuG40gCn8Eo4zBnqDolrB3rBwkTn4Bgofn4B4xrB_Yw1mBAgl8BoG4mQ4SwxjBgZgnY4rB4wkBwMw0foGgvFAgvFoGw6Xofw7ewMwqLoGwksBnGw8MnG4jUAw7FnfoufvM4hGvlB45YnfolS_qCgve_1E4gxBnxC4uWv3CowU3hG4mpBviFwien1F4oe3oFg5Z_uF4yZ3vEwkTvmIoghB36G45Y_uFgxTvpEooO_1EwuOn1F44R3hGg_R3hGwyRv0G44R3xSwvuBn9Lgkc36GwnP33Ko7W34Rg-jBv-a4yyBvtHgiOnxb4yyB3jUw8lB32con5BnkLotY_-Ro6oB_1EwqLnhP4imBvlBgkD3rBoqDvtHo3T36GwkT39C4sIv3Cg6Hv1Nw5pB_uFw5Qv3Cw4JnjEwuO_gH4gYnkLg7nB3nXos8Cv0G4yZnghB4-mEnxCorKnngBg6kE_8Dg0PnmZo4lDviFopV_rJw8lBv-B4sIv0Go4a_gHg9cv7F4gYv7FotY3rBo1Fnf4vE_yI4imB_nGghgBvpEguXvpEwwc3rB43K3kC4_Q3rBwxKn4B4mQnf4wLnG4kCn4B4uWvlBo-Snfg7OvMovNvMo9L3So8dAg9c4So6oB4rBoghB4rBomZgrCwmhBgkDgpmB4oFgr0BgsJw83Cg2EoonBoyJov4Cw3C4vd4S4hGgkD43jB42Doq1BgrC4toBgZg2doGgz6BvMo-Sn4BoonBn4Bwlav3CwtgBnxCo7W39CggZvpEw3bnqDgqUvwD4qTvlBouGv-Bw_I36GwtgBn8EowU_kK47mB_jDg3L_xBouGn5I4oevmI4kbviF44Rv0GwvVngIgkc3lJ4oev5Qwj-B3iNoy7B32Do3T_jDo3Tn8E4liB32Dw_hB3kCw6X3rB4gYvlBgvenGgveAw8MofwwcgrCozpBofolSgrCguXw3Co0Xg9Dw-aghH40nBw7FgrbgzIo2lBglKgpmBgtQou4BoyJg2d4vd4q-CgvF44RgmRgl8BgzIo5hBg9DwnPwmI4imBghH4wkBwmIggyBo8Eg-jBo1Fww1B4rBwnPgyBopV4SgsJo4Bo6oBoxCg6yCoGo5IwM40OgZwqkBwMo-SoGgpNwMo6Pofojdw3Co56BgyB4oeofw1NgZw8MoxCgrbgkD42cw0Gg91BwxKwooCoqDgxTg3LowmCw_Io0wBg2E4yZg4SgylDgyBgsJoyJox0BwlB4zHgZg2EwxK4i_BgrCw1N4SwpE4rBorKwpEg2d4oFgwlBouG4v2BgrCg8VgyBg0PwwD4qsBg2Eg65BgZ47NgrCo7vB4rB4kbwM4-JofggyBoGgtQ4SozpBwMggZAgjVvMw4iB39C4ijF3SwievM4gY_YoxbvMw5QnG4pMnG4_Q_YoivBvM44Rn4B48_CvlBwhpCAou4BwMolkCwMolSwlBw_hBA4rBoxCg4rBgZ4_QgyB4wkBgyBggZwM4hGwMw7FwMwiFoxCgmqBwM4hGw0GghrDw3Co56BgrC438B4So56B_Y4oenfwvV3rBgtQvlBwnPn4BwnPnjEgrb3vEw6XnxCwjM_1EgqU_8Dg7O_8D47NvpEgiOnjE4pM3zHopVngIgjVnuG4mQ3-Jw6X_8Dw_I3mQorjB3zHo6P_uFg-K3hGwqLvtHovN_gHo2M36GgzIv3CoxC_jDgyBn4BoGn4BnGn4B3Sv3CnxC3rBv-BnxC3oF3Sn8EwMnuGwlB3oF4kC3oFw3C_uFo9L31Vg9D_gHoxCojEw3C4vE4oFgzI4kCwwD4rB4kCoqDg2EgyBgrCw-B49C4lJooOwiF4zH42Do1Fw-B49CoxCg9DgkDo8E4wLolS49Co8Eo1Fw4JgyBw3CgyBw3CoxCwpEgyBg2Eg2EwxKogI4qTw6Xwq9BwwDgzI4vE4wLwiFo2Mo4Bg2E4rB42D4kCw7FoqDorK4Sw-Bo4Bw0GoqDw8Mo4B4sI4vEg9c4kCwrSwlBglKof4sIw-BgjV42DwgpBw3Co4aof4zH4rBg3LwMoqDo4BolSgyBohPw-B4qT42DoghBwwDwtgBwwDgof4S4hGg9D4toB4rBoqDgZ4zHgZouGwMg9DofgsJgrCguXgZo2M_vMo8E3kCwlBv3C4rB39Cw-B_1E42Dv3CgkDv0Gg2EvwDgkD39CoqDnxCw3CnxCojE32Dw7Fn8EoyJn4BoqDvlBgrCvpEgzIv7Fg-KvlBgrC_xB42D_qCgvF_nGozQ_rJgya_xBouG_qCoyJ_xBwmIn4BwnPvMghH_Yg9D3SwiFvMgpNnGg8VgZ47NgyBwuOgrCovN42DwnPofojE4kConHojEwjMo4Bo8EwlB49Cg9Dw4JgrCwwDg2EojE4oFwwD49C4rBwwDwlB4rBof4rBwlBgyB4rBoqDgkDgvFwpE4sI4hGojE4rBw3C4Sg9D_YonH3kCg2E_xBwiF3rB4kC3SoxCvlB42D39C49CvwDw-B39Co4Bv3CgoGn9LwtHvjM4vEngIwpE_5H49C_1Ew3CvpEg2E3zHoxbwmIvoWgljB_rJg7O3_BsjD4_BrjDgsJ_6OwoW_kjBnxbvmI_1E4zHv3CwpE39Cg2EvpEg6H3vEogIvtHwjM_nGo9Ln4Bw3Cv-B49C39CwwD32D49CnxCwlB3kC4SviF4rB_1EgyBnnH4kC_8DgZv3C3SnjE3rB3sI3hG_uFvpEnqD_jD_xB3rB3rBvlB3rBnf_uF_1EnnHn1FnjEnjEv-BgZ3vEgyBv3CgZ3kCwlBv-BgyBnf4rBv-B4vEv-Bg6HnfoqDn4BojE3kCwwD3kCgkD_jD4oFv3CwiFnjEghHviFw4JnqDw0Gv3Co1F_1EorKnjEgsJ3kCg2En4BojE_xBg9D3rB42DvlBojE3rBo1F3S4kC_jD4iN39Cw8M3kCwmI39CwqL_Y49C_qC4hG3kCgvF_qCwiF39C4hGv0GohP_qCo1F_uFg3LnjE4lJ3sIwvV3rBg9DngIwvV_uFwgQvlB4vE_qCo5I_Y49CvpEolSn4BghHvM4kC_jDovN3hG4rav3CouG3SgrCnjEozQ3vEg0PviF4xS_8DgpN_nGotYnjEw5Q3rB4oFnxCoyJnjE4tP36Go4a_uFwvVvxKozpBvtHwpd_8Dw1N3vEgtQnjEwtH3rBof_jDgZ_uF3vE3zHv7FvpEnxCnxC_Y3kCnG39C4SnxCw-B_nGw0Gv-BgyBnqDw-B3kC4Sv-BA39CvMvwD_xBn8E39Cn8E3kCnoOv4J_mY30O3-Jv7F3tP_yIvoWvxKvrSvmI3pMviF36GnxCnrKnqD_nG_qCnuGv-B_hO_jD32D_xB32DnxCv3C_8D3SvlBnfnqDvMv-BA_8D4SnjEw-B3oFo4BnxC4rBvlBwlB_Y4hG39Cg6HnqD4rBvMw3CnGoxCofofgZo4BgrCwlBoxCgZw3CwMoqDAgrC3rB4-Jv-B46G39CorK3rBojE_uF44R3oFg_RvpEohPn8EosRnuG4ra_1EwhX3vEg1W_jD4ra3rBwgQ32DgrbnfogI3rBorK_jDw-avpEww1B3rBw6X3rBo9kB_Y46fnGwie4rBo3sBgyBw8lB4rBwzYw-B4kb4-J4zrD4kC49bo4BojdwlBw7ewMgnYvlBw7e3SgwMnGwpE3kCguX_xBw1N_qC4_Q3kCgpNviForjBnGo4B_xBw_I36Gg0oBnzQ4uhD3oF49bvwDg_RviFo7W39Cg3L_uFgxT3sI4yZv0G44RnnHosRviF4wL3oFg-K32DghHv0GwjM_nGwxKnkL44R_kKwnPnvNo3Tn9LwyRn6PotY_kKgmRnjEonHn8EoyJvtH40O_nGohP36G4qT_jDoyJ_1Eg0Pn1FwvV3oF45YnqDozQnxCgmRv3CwvVvlB4sIn4Bw5Q_xBovNv3Cwla_qCw6X_xB4tP_yIosjC_YwpEnxCw5Q3vEgya39C40On5IwksB_gHouf_xB4hG3hGotY_2LwksB3lJ46f_kKo5hBnxbwj3CvpEgiOnjE4pM_pUg_jC3sIg2d3zHoxb39C43KvwD4pMn8Eg4S39Co9L_5HghgB33KgnxBvwD4mQ_uFw3bvzY4iqE3oF4vd_6Ogw3C_gHohoBnrKgs7BvvVws9DvtHwyqBnkLosjCv3CwgQvpEg2d_8D46f39C4oe3rBg8Vnfo7WA4vdgZw3bo4BwunBgZw4J4kCw3b4oFotqC4rBoqc4SwrSoGopVnG4uW3rBo9kB3SgiO3rBg8V3kCggZvlB4-JnqDoqcn4BgpNn4BwqLv7F4-iBnxCgiOnxCo9L_gHongBnxCwxK_kKokkB_vMginBvjM43jBn3Tw-zBngIgqUnkLo4a_2LgrbntYgk1BvjMwzY_jcg22BnnHovNn2Mg1WvkTg6gBnyJwgQv8MgqUvkT4vd3lJo2M3qTwwc_1dgtpB_hOw2U3zHwjM_nGw_InlS4hf3kC4vEnkLw2Uv5QgtpB32DglK_nG4xS33KgwlBn8EwvV36Go9kB_8Dw6Xv-BwnPn4Bg4S_jDgtpBv-B4mpB3So1eoGw7ewMgqU4rBwnoBo4B43jBw3CguwBofg0Pw3Cg3kBwMgvF42Doq1BgrC46fgyBopV4oF41nC4-J4ppEw7F4zyCg9Dg91BwMwpE42Dwp2B42Dg5yBoGoqDojEw_6BgkDowtBgZgwMoxCorjBof40O49C47mBwpE48mCo4Bw1mBgZopVgZoghB4SgjVoGovNgZw14Cof4yyBgkDw83CgkDo_yBof4_QofolSwlBo7WojE4_iC49ComyBoxC40nBgsJo6lF49Cwx8B4rBwtgB4rBg1vB4SghgBgZo3lCnGoj2BAwnPvMw2tB_Yg5kD3rB4k_DvMg0P3SowUvlBghgBvMg2E_Yo6P_xB41Vv-BwienqDo5hBnxCgnYv-B47Nn1F44qBn8Eg6gBvmIopuBnyJ41uBnqDg7O_9KgqtBnzpBg7kFv7FwlavtHgljB3hGorjBnjEwpd3vEg3kB_xBg_Rv-B4hf_xBorjB3Sww1BoGwunBofghgBgrC45xBgvF4ktCwiF4z5BoqDgljB4wL4vhEgkD46fo1FoogCwpEwi3BgkDo13Bo4Bo7vBgZg3LofgzhBoGo7WoGwjlBvM4plBnGgtQn4BgnxB3SwnP3kColrB_1E4thCv3C4kbvpEgljBn8E43jB3hGw1mB_uFwienjEw2U_jD47N_1E4jU3vE4xSnjEgmRn8Eo-SvtH4kb_uF44RvxKg6gB3kCouGnnH4jUnkLo8d33Ko4avyRwnoB3lJo3Tv5QoghB_vMg1W33K4qTn3TwtgBv2U4oensRggZ_oNolS34Rwlan5IooOv4Jg_Rv4J48U36GozQv7FwyRviFosRn1Fg5Z3kCg3LnxCwrSnxCgnYvlB48UA44RoGovNgZ4tPwlB47No4B40OgkDo-SoqDgtQ4hGguX4oF4_QoxC46GgrCouG49CogIogIolSooOw-aw4JolSoyJw5Q4vEwtH4tPg5ZgpN4uW4sIg7OwiFw_Io2MomZgzIo-SojE4-JghH4xS4oFgmRwtHgya4vEgxTgoGongBg2E4zgBoqDw7ew3CwunBgyB46fgZovmBoGws9DgZg-8B4SggZofwlaw3CwvuB4kComZw3CwieojEo9kBwpEo5hBoxCwgQwiFw7e4vE4yZwlB46G4zHginB49CwuOwpEowUg9DgtQo4BwtHwiFgqUg6HojdglKo9kBw4Jw0fw-BouGwjMwqkBonHgqUojEokLo4Bo8E4zHgqUw0GozQoqD4sI4_QohoBgiOo1e4lJg4Sw2Uo6oBgyBw3Cg_Rw0f4iNg1WwqLwrSw4JohPohP4uWo2M4xSwoWoufgqUwpd43KwgQorKozQw4Jw5Q46Gw1NorK41Vo5IgjVwwDgsJ4vE4pMouGo3To8Eo6P46Go4aghHgsiB4rBghHw-BwqL4rBorKg2EohoBgZo5IgZokL4S4pMoGonHoGgoGwMwrSnGgmRnf4uWn4BgnY_qCo0X_qColSnfonH3S42Dv-Bg3L_qCwjMnxCo2MnqD40On1F4uW3vEo6P3vE40O3lJ4kb_gHo3Tv4Jgya39CwmI3hGg0P_uFooOnjE4wLv8MokkBnvNwrrBvpE4xS_jD4tP3rBw_I3SojE_xBohPnfgtQnGgtQ4S47NgZwxK4rBw8M4kCwuOo4B4lJ4kCgsJg2EgtQ4sIo4agiOw5pBwtHg8Vw3CghHwwDgzI46GwuOghHo2MwwDw7FgoG4lJouGgzIo8Eo1FwpE4vEghH46G4sIghHo5I4hGwiFgkDo5I4vEo5IwwDwiFgyBo8EwlB4sIgyB4zH4Sw4JnG4vEvMwtHvlBwjMnqDw3bv4Jw7Fn4Bw7F3rBwjMn4BgvFnGouGoGg-K4rB4hG4rBgsJgkD4hGoxCgvFw3C49CgyBgkDw-BonHo8EwiFg9DwiFwpEwxKorKg2E4oFghHgzIg6HorK4vEouGwpEouGwtHwjM46Go9Lg-Kw2U4-Jw2UolS40nBg4SwrrBgpNongBwmIw2UozQg4rBghHo-So9LgzhB4-J4vdo2MoonBw1Nw9sBwmIoqco9Lg_qB4tPok9BwmIokkBwxKgnxBgyBw0GwmIg0oBwlBo1FgyBwmIgvFw7e4oFg2d49C4_Q4lJg-8BgZw0G4zHgs7Bo4BoiW4S4iNA44R3So2Mv-BwlanxC4mQvwDw9T_8DwyR_uFosRnjEg3Ln4Bo8Ev7FohP_xBgkDvpE4lJnxCg2E_qCg9D3vE4zH_5H4pMn1F4sIvtHgsJn5IgsJnjEoqDvmIg6H39CgrCn5I4hG3vEw3C3wL4hG_2L4vE3hGo4BngIo4Bv4J4rBvuOgyBn9LgyBngI4rBnyJw-B3-J49CvtHoxC_kKojE3sIojE_6O4sIvtHo8Ev_IouGvtHw7Fn5IwtHvtHghH3vE4vE3lJ4-J_nG4zH36GgzI_5Hg-K_1EghH33Ko6P_uFw_In1Fw4JnxCojEvjMopV_1E4sI33K4xS32Do1FvxKwyRnoOg8V_6O48U_sQw9T_yIoyJ_gHwtHv-Bw-BnrK4-JvwDwwDv3Cw3C_2LglKnrKgzI3zHgoGvyR47N3kCof_rJ4oFvjMwmI30Og-KvpEgkDnjEw3C3lJ46G_kKogIv_I4zHnqDw-BnqDgZ_jDnG3kCvlBv3Cv3Cv3CviFvlB_8DvMvwDoG_1EgyB3hG4S_xBgyBv3C4rBn4BoxC3kCgrC_YgyBnG4rBA4rBwMwlBgZwlBwlBoxCwwDoqDwtHouGoufwxKwlzB4rB4hG4vEw9TgyBouGgyBo8E4zHwieg9D40O49CwmIofgkDoqDorKoyJojdouGwrSo4BwpEwtHg8Vw4Jw3bgyaomrC4oFwnP49C4lJ4vE4_QwiFg1Ww3CgtQoxCwrSofo5IgyBopV4S44R4SwxjBo4Bo4zBAgvFAo6PvMozQnfgjV3rBgnYvMw_InGwmIv-BwunBn4B48tBvMwjMnGw_IoGg1WofomZwwDwi3B4So2MgyB4liB4So-SAgsJnGgsJvlBg4Sn4Bg4SnxCwrS_jD4xSv1Ng6yCv3C44R_qCwrS_jDgrbn4BopV3rBw6X_Y4ragZw60EoGo3T4SwyqBwM45qCoGg0PwlBolrBofgqU4Sw0GoxC42coxCopV4kCg7OoxC4tPoqDw9TwwDolSgrC43Ko2Mo_yB4sIw_hBoqDovNgvFg1W4kCoyJg2EgjVofg2E4oFgsiBw3CoiWgsJwskD42D49b4oFgkcwwDgtQ4wLg8uBwqLo-rBw7F4nXwpE4qToqD40Ow7Fgve4rBgzIgyBorKgkDo0X4kCo3To4Bw9T4rB4jUgZowUwMowU_YgknD_xBgiyDvMg91B_Ygi5C3Sw30BwMw2U4SglKgyBw5Q4rBgpN49CwrSojEw2Uo8Eg4SoqDwqL4lJ4hfwqLwunBoqDgpNojEgjVojE4zgBo4Bo3T4rB4qTgyB4xSgyBg1W4oF4qsBojEo0Xg9DgxTwiF41VwnPw47BojEolSgrCgwM49CwkTw3Cwie4So9LwMg8Vnf4nX_uFg_jCnrKwwgE_xBg7O3kCwnPvwD48UvlBgvF_Y4vE39CwnPv7Fo8d3kCwjMnuGongB_wTgylDnuGgzhBnxCgiOn4B4wLn4B4tPvlBovNvMg3LoGo4aofgmRw3CotYw3CwyRoxCo2MofwiFojEgtQ4vEwnPwwDg3Lg2Ew1NojEo9Lo1FosRg9DwjM4zHotY4vEozQwpEwrSo4BgzIgyBw_IwlBw_IwlB4lJ4rBo6PgZo9LoGo-SvM4xSn4B49bvwDgjuB_xB4yZnGgrCv3CokkB_8Dgk1B3SwmI_8D490B_Yw4Jn4Bw6XnjEgz6BvlBgyanG40O4SotYwMwtHof47NwMonHgZwxKofgsJoqD42c49C4yZg9Dg9cgzIwgiC42Dwie4kC41VwMwiF4rBwkT4Sw-anGg1W3rBwkTn4B4mQ3S4vEvpEw6Xv3C47Nv-B4sI3kCwxK36Ggve39CgpNv-Bw4JvwDgqUv3ColSn4BwrSnf4iN_YosRAw8MwMgwMo4BwlawlBwjMofo5Ig9Doqc49CgjVoxCg1WwlB44R4SosRnG45YnfolS_Y4iN_qComZngIojvCvwDorjB3kCo8d_YgjVvMoiW3rB44qBvMwoWnGwxK3S48U_YosRvlBwrSn4BwkT3vE4plBvqL4_7C_1EgpmB_qCo6PnjE4gY_uFotYviFg4S3kCghHviFgmR33K4imB32Dg7OvwDg0P3rB46Gn4BokL_xBwxKn4B48U_YgnYAwmInG4_QvMw9TnGg0P3SorjB_Yw9T3S4wLvMgvFnGojE_qCw1mBvMooOoGgiO4Sw5Q4rBopVgrC4xS4oFgkcgZ4vE4kC4lJg-KozpB4pMwhwBwvVgoxCo8Eg_R4mQ4s6BonHw-aw9T4yrCwwDgiO46GgrbwpEw9T49C4xS4kColSgZgzIofooO4So6P3So5hBn4Bg4rBvM4gYoGolS4SohPwlBooOoxCg8VoqDw9ToxC4pM4vE4xSo8EozQwwDorKouGw5QgrCgvF4oF4wLwiF4-JojEwtHw0G4wLwhpCol2Dw0Gg-K4hGw4J46Gg-Ko5IwnPg2Eo5Iw3CgvFw-Bg9DgrCwiF42DgzI49ConHwpE4wL49Co5IgkDgsJoxC4lJw3CorK4vE48Uo4BgsJ4rB4sI4rBw_Ig9DojdofwtH4hGo-rBouGw6wB4oFohoB4vE4liBoqDggZg0Pw50DghH4v2B49CwzYojEghgB42DomZw-Bo9Lw-B4wLo1F4rao8EgjVg2Eg_RwtHg5ZojE4iNwmIo0Xw8Mg6gBw7FgpNg7Ow7eo9LgjVg3L4qTouGglKw1Ng4SwxKw1NogIw4J47Ng0PgwMgpNgnY4ra4imBwnoBo3T4uWw4J4pMoqDg2EwpEo1F4vEgoG46GorKgzIw1NogIovN4pM4uWwqL4nXo2-B4lmE4tPo5hBgoGw8MgyBoqDojEogIo1FokLo2M4uWo2MowUo5Iw8Mw7FwmI4-Jw8Mw_Ig-K40O4mQovNw1N4pMwjMgtQohP44Ro6P40OgpN4jU4qTgvFgvFokLwjMohPg4Sw5Q4nXg6H4wLoyJ4tPg2Eg6Hw5Qo1eouGgwM4gYw-zB47NwieosRo9kBgrbwm6BgyBwwDoxCo1FwMof46G40OojE4sIgtQ43jB4vEgsJg6H4_Q4iNw3bo2Mo4aohP46fgpNo4agrC4vE49Co1F4_Qg9co9L4qT49Cg2E49Co8EgoGw4JwwDo1Fg4Swwcw0GorKgqmCo5sD4raohoBo9LosRo5IwjMwpEo1FokLgpN4zHgzIonH4zHw2Uw9To8dgyaoioC40gCw8-Bw73BwwDgkDoy7Boq1Bgm8CghyCg-K4-J42DoqDwiew-a4s6Bgr0B4opDg49Cg4SgmRwie4vdwrSowU4oFgoG42Dg2EorKo2MgiOg4Sw8Mg4Sw4Jg7OorKgtQ4zHw8MwjMw2Uw-BoqDonH47Nw8MomZgxTw1mB4oForK4pMo7Ww4Jw5QwiFwmIghH4wLgsJwuOoqDo8E4yZwunBg6HwjMwiFogI4pM4qTwiFghHw0GwxKgrC42Dg6HwjMwjMg4SgzI4iNwpEgoGg-KosRgkDo8EosRo4a4oFogIgoG4lJwpEgoGwqLwuOgzIg-KgvFouGolSgxTwxK4-JwmIwtHgiO4wLw8MgsJonHo8EghHg2E4wLghHw1Ng6HwiF49Cw2U4pM4-iBw6XgwMo5IwxKgzIg2Eg9DgiO4pMg9DwwDoihDg75CggZ4nX4oeojdg7O4mQ4qTwhXwuOg_Rw4iBw9sBoqc4wkB4wLg7Oov_BghyCg4S4yZ46Gw4J4pMg_RwyRoxb42Do1FgoG43KwuOotY4_Qg2dg1hD4qpFw7FglKo4a48tBgiOggZo0X47mBgyBw3C4wLosRwnPoiWg3L4mQwlaokkBwwcginBouGo5Iw8M44RwiF46Gw3C42DoyJo2Mg7OgqUwmIwqLg4So_ZopV4vdo4BgrCwmIwqLo5Io9L4thC405C4-JgiOouGoyJgiOoiWo5IwuOwmIgiOwsZw9sBgoGokLgnxBg-1CglKg_Rg3Lw2Ug-KwkTgyawvuBwvVgwlBg4S4zgBw3C4vE4sIg7O4Sofofo4B4kC42D4vEg6Hw1NgnYw7ForKo1Fw4JgpNo0Xw0Gg3Lo2MwoWw_IwgQgvFoyJooOwsZo5Io6PghHo2MojEg6Hg3LwoW4iNo_ZwtHohP4lJgxTorKotYo5IopVgrCgoG4rBoqDojEwxKwqL46fwiF4mQwiFg0PwpEooO4vEwgQwtHw3bg-KoivBgoGw0f4vEgya42DotY42D4kb42D4liBgyB4qT4S4sIgZgsJ4rBg4Sof4mQwlBg5Z4SozQ4rBo6oBgZoqcgZg2dgZ4yZ4SwiewM4-J4S4tP4rBw0foxCo0wBofovNwlBw8MgZw4JgrCoxbogI448CwwDwnoBwlBgiOw-BwhX4rB40O4SonH4S4hGg2E4o3BoqDg7nBoxCw7eo4BgzhB4rB46fgZomZgZw6wBvMopuBvlB44qB3rBoghB3rBwzY_qCwxjB3vEox0Bv-B48U3tPg0lF39Cwpd3Sg6H3kCg8Vv-BgxT_xBo-S_Yo5I39Coqcv3Cgve3kCw2U32DozpBn4BwhXvlBgxTn4Bo5InfokL3rBo5hBnGwoWnGwwDvMoyJAojE3SojE3S49Cv3CgoGn4B49C_qCw3C32DgvFv-BouG3SghHoG42DgZ46GgyBouGw-Bg6H4So1FnGoqDn4Bw7F_jDo1F_YgyB39CghH_YwlB_nG4-J_jD4oFnxCwpE37No7W3wLwkT3sIovNv7FgsJ_xBoxCvkTgof_8DgoGnxCwiF3kC4vE_Y4kCnfgrCn5Igya_1EohPv3CgzI3kCogI_jDgiOvwD48Uv-B4iNnqDo6Pn4BouGnqD4-J_jDwtHv3C4hGv3C4oFvwDo1F3oFwtHvpEw7F_5HwxK3pMgmR3rag-jBv-aokkB3vE4oFn1Fg2En1F42DnqDo4BnnHg2EnnHw7F_nG46GnxCoqD_sQg5Zv0G4-J3sI4wL_kKgwMv_Ig-K3sIoyJ3wkBwunBvmI4lJvgQo-SvxK4iNvnPwvV_9KwrS_gH4iN_yI44RvpE4-Jv_IguX_uFozQvmIwla39C4sI39CwtH_uFo2MvpEoyJ3zHohPnnHw8MnuGorK_nGgsJ36GoyJ37N4xS_1Ew0G_uFgzI_nGokLvmI4xSvtH48UviFwkTvtHoghBnqD4tPnxCw4J3kCghH_1E47Nv3CghH39Cw0GvpE4sI_xB49CvwDw7FnjEouG_8DgvF_nGg6H36GwtHvwDoqDviFg9D_8Dw3C3wLghHnuGoqD_gHwwD3wLwiFvxK4vEnlSgzI_sQglKv0GwiF_jD49Cv0GgoG3hGouGnuGg6Hn1FogI_uFgzI_nGwxK3-J44R_jDwiFvwDwiFnqDg2E3kCgrC3vEwiF3rB4rB4rBwpEo4B4hGgZ4oFoGwmI_xBokkBgZ48Uof4pMg9DwvuBgZwqLwMg-KAg6H3rBo3TvlBokLv-BovNnqDw5QnxCglK39Cw4JvtHopVvmIg8VnxCwtH39CglK_xBw7F3kCoyJv-BgiO3SgoG3So9LAwiF4SgpNgZgsJgyBg7OgZ46Go4BwuO4rBo-SwMouG4So9LoGg-KAwxKvMw_I3SwmI3S4oFwM4vEgZoxCgZo4Bw3CojEwiFwtHgiOopV46G4wLw0GooOw7Fw8Mw3CgoGgoG47N42Do5IgkDg6Hw3C4zH46GgqUgoGo-S46GowU49CwtHoqD4oFg2Eo1F4kC4kC4hGg2E49CgrCouG46GoqDojEgrC4vEgZ42DAw0G3SgzI3rBw7Fv-Bw0G3kCw7Fv3Co1Fn4BwwDvlBw-B3rBgyBv-BgrCnoOw8M_rJ4sIn8Eg2E_1EgoGv0GglKnqD4oF3zHgwM3kCg9D_8D3oF3hGvtH3vE_1E_jDnqD_YvMvMnGnf4SvlB4rBnxCo1Fv-BgvFnGgZ_Yw-B_1Eg3L_jDogInfw3CnqDw_I7QwqB",
          transport: {
            mode: "busRapid",
            name: "FlixBus N1325",
            category: "Coach Service",
            color: "#73D700",
            textColor: "#FFFFFF",
            headsign: "Bialystok, Bus Station",
            shortName: "FlixBus N1325",
            longName: "Bialystok - Amsterdam - Lille",
          },
          agency: {
            id: "65528_ba99721",
            name: "FlixBus",
            website: "https://global.flixbus.com",
          },
          attributions: [
            {
              id: "d2a3dda55cb717c0cc9a9d085a4e6870",
              href: "https://flixbus.com",
              text: "Information for public transit provided by FlixMobility GmbH",
              type: "disclaimer",
            },
          ],
        },
        {
          id: "R1-S4",
          type: "transit",
          departure: {
            time: "2025-09-30T21:15:00+02:00",
            place: {
              name: "Hanover central bus station",
              type: "station",
              location: {
                lat: 52.378922,
                lng: 9.740987,
              },
              id: "65528_733",
              code: "H",
            },
          },
          arrival: {
            time: "2025-10-01T06:50:00+02:00",
            place: {
              name: "Copenhagen Busterminal",
              type: "station",
              location: {
                lat: 55.66449,
                lng: 12.56091,
              },
              id: "65528_6763",
              code: "KHG",
            },
          },
          polyline:
            "BH86xhnfw1t55F8QvqBoqDv_Iofv3CgkDngIg2E_2LgZv-BoG_Yw-B_uFoxCn1FwlB3rBof3SwMoGgZwMgkDoqD4vEg2E4hGwtHg9D4oFw-BgkD4kCvwDoqDviFgvFn5Iw_Iv1NouG3sIgrC_qCwxK_rJovNvqLo8E3oFw3C3vEw3Cv7Fw3C_gH4kCv7Fo4Bn1FgvFv4J42D32DwwDv-BgyBoGw7FwMwpEwMogIgyBorKo4BwtHgyB4hGgZ4vEwMo5I4rBwwD4So9L4kCwiFof43Ko4BokL4rBwxKgZojEgZojEgZwpE4So6PgrCgoGwlBwxKw3CglK49C4oF4rBgkDwMwiFwlBw7FofooOgkDg2EwlBwtHgrCwrSojEwtH4rBgsJwlBw-BoGwmInG47N3rBg2E3S41V_jDo2Mv-Bo6PnxCw8M3kCgvF_Y46GvlB42D3SoqDvMw-BvMg3L3kCghHnfw9T_qC4hG_YghH_Yw9T_xB42DvMwpdnxCofnG4zH_YofnGgzIvlB4lJvlBwuO_qCw4Jn4BwmIvlBouG_YoxCvMooOv-BglK3rBomZnqDgyBnG4lJvlBgrCvM42DvM49CvMo7W39Co9L_xBw8lBn8Eo2M_xBogInfghgBnuGgxTnxCw_IvM4hGvMg3LvM4-J4kCo9LgZ4_Q4kC4vE4S4lJwlBw3CoGgrCnGo8EnfonH3kCwiF39Cw7F3vEg9DvwD42D_8D4rBnxCg2E3zH4oFnyJo4B_8Dg2EvqLoxC_gHw0G3jU4oF_6OgkD3sIgkD3zH4hGn9L46G33KgoG3sIghHngI4lJ3sIg2E_8Do1FvpEouGnjEwqLnuGohPvtH4uWv4J49CvlB40O_gHwpE3kC4sI3vEwtH_8DgoGvwDwhXnvN49Cn4BwpEv3CwlB_YgrCvlBwkT33KwwDn4B4hG_jD4-JvpEouG_qC43K39Co5I3rB4oF3S4-Jw-BoqD4S4vEwlBwwDgyBwpEgrCw0Go8E4zHo1F4vEgrCw0GgrCgzI4rBwwDA4hGvlBgrC3SwpE_xBg9Dn4BogI3vEg2E3rBo8EvMw7FwMgrC4So8E4rBw0Gw3CglK4hGw7F49Cw7FoxCo8Ew3ConHojEw-BoforKg2Ew_I42Dw-B4S4-JwwDovNo8E4-J49Co2M49ConH4rB4kCwMo8Eof4tPw-BojEwMw_I4S4hGoG44RwM4hGnGw0GnGw3bnxCoyJ3rB48U_8DgkD3S4zH_xBgmRvpEwvV3oFwu5C3yZw6XnuGotYn1FgyaviFonHnf42D3S49CnGwzY3kC42DnG4vEnG4pMnGwkTgZw8M4rB4-JwlBo2M49Cg_Rg2Ew5Qo1Fw7F4kCosRg6H4tPogI4rB4Sw5QorKgtQokLwwDoxCw-awhXwpE42D4_Q4_QwnPosRg-Kw8MwtHw4Jw4J4iNwwDg2Eo9LgmRonHg-KwpEghHg9DgoG4kCwwDghH4wLg2EogI4lJw5Q4lJgtQgkDo1Fw-BojEghHw1NovN4kb4lJ4xSg1WwzxB45Ygh5BwkTg4rBwpdgxlCgmRw1mBgyBoqD4-J41VwxKo7Ww7FwjMgkDgoG41Vg_qB49Co1Fo6Po8dw_IwgQo1ForKwnPo4ag2E4zHo5Ig7OwvVorjB47N41VwyRo_ZggZwqkBolSotYo2MgtQ43K47Nw3CwwDohPo-S4oFw0G4iNwgQoxbw0fghgBgsiBo13Bgo4B4yZwzY4hqDg2oDg5rC45qC40nB47mBgkDgkDo4Bo4B4iNwjMgsJgsJwjMw8M4-Jw4J42DwwD43K43KwtgBwtgBo2M4pM4xSg_R44RosR4-Jw_I43Kw4J4mQovNgvFojE4zH4vEoxCwlB4oFgrCg6HoxCojEgZogI4SwmInfojE_YogInxCg6HnqDg6HnjE42D_qCokL_yIwwDnqD49CnqDghH_5HgvFnnHg9D3oFw7Fn5IgrC_jDg9D_uFgkD_8DouG_5H4-J3-JghH3oFwwD39CgkDnxCg6H3vEg9cn6Po2M36GghH_8D4miCn9kBwgQn5Iw-Bnfg_Rv4Jo1FvwDgvFvwDg9Dv3Cg9D_jDojE_jDwwDnxCglKv_I4_QvxKwxK36GgwMngI41V_6OgvF32Dw8Mv_Ig2E_jDgwM_rJoqDnxCopV_sQ42Dv3CgwM_kK4ravoWwie3kbgnYn0XwjMn9LgwM3pMgvF3oF49CvwD40O3tPwmIv_I49CvwDoyJ33K4yZn8d4-Jn9LoyJn9Lo8E3hG4vEv7FoyJ3pMonH_rJgoGvmIgtpB_55BghgBnpuBw1mBv04Bwwc_spBokkBnmyBw5QvoWoghB3mpB4kb_ggB41V_mY4wkB37mB49b_qb4mpBv8lBo8EvpE4iN3wLwnP_oNg0P_oNw_I3zHgmRnoOg6gB3kb4kbniWwtH3hG4zHnuGwoWnlS4rBvlBwyRnoO44RvuOojEv3CwxK3lJ4hGn8EwxKn5I4wLnyJgmR37N44uEn6zDox4Evh7D4yyBvnoBgh5B38tB4kbvvVowtBnkkBoxb_7Vo4B3rBwwD39C4oFnjEgzI36Gw8MvxKo4B3rBokLn5I45Y3qTglK3sIwwDv3ColS_hOgvFvpEg6gB_4ZongBntY4_pBv7egxsB_nfgnY_sQ4qsBnjd4yZ3mQwuOv_Io_Z_zPwgpB_mY4_pB_tX4qTnrKgzhBvyRohP3zHwkTnyJgkD_xBorKviFg8VnrKgpN_nGwwD_xBoxCvlBwjM_uFwmhB30OgzI32DwpEv-B4_QnnHwiF3kC42D3rBo3TvtHo9L3oF4-J_8Do5InqD4iNviFg8VvtHopVngI46G_qCgzI39C4mQ_uFg3L32D4mQ3oF4yZ_5Ho1ev_IgvFn4Bg2d_5Ho6P_8D4hGn4Bg8uBvqL42D_Yg1W32DgzsDn7WgvFvlBgvFnf4zgBnuGwpEvlBgoG3rBotxBnyJwjlBvtHoj2BvqLw-a3hG4s6BnoOouf3sIgxTn1F42c_yI4ra3sI4zgBnkL4zgB_2L48tB_-RghgB3iNogInqDg6gB30OoxCvlBw-Bnfo13Bn4a47N36Go3T33K4oFv3Co1e_sQwtgBvrSgnY_hOgqtBnxbgpNngI4vdv5QoxbnoOwvVvxKg91B_tX4pMn8EowUnuG4jUvtH49bvmI47NvwD45Yv7FwunB3zH4lJ_xBosR_qConHnfwuO3rBw4iB_jDwie_Yg5ZA4pM4SggZof40OwlB4sIgZ45Y49Cw8M4kC4tPgkDo5I4rBoiWojEw1mBw_I4hGo4BogIgrCwtH4kCwmIgrC4xSw7ForKoqD4vE4rB4hG4kCo8Eo4Bg_Rw7F4tPg2Eo2MwpEo9Lg9D47Ng2EwqLg9D4wL42DgmRw7F4sIw3Cw4JgkDoyJoqDwqLg9Dg-jBo9L45xBosR421B4xSoqcgsJozQgvF4oFo4Bw8Mo8EgigCwvV4mQ4oF4tP4vE4zHw3C4iN4vEwiFo4Bw0G4kC4oFo4Bw0G4kC4sI49CgnYogIg6gB4wLwunBovN4sIw3Co8EgyBwtHoxCwvVonHg_R4hGotYwtHg-jBo9L46G4kCwmIw3CoyJoqDgkcgsJg2EgyBwvVonH44jCg1W4gYonHwpdogIg3L49C45Yo1FohPgkDo4ao8EwnPoxCg2Eofw47Bg-K4wkBonHwqkBw0G4-iBgoG4kbo8E4jtBgzIo6Pg9DgiOwpEo0Xw_I4jUw_I40OwtHoxC4rB43K4hGwmIg2Eo2MwmIo4BofoqD4kC40OwxKwiFg9DoqDoxC4oFwpEwjM4-JwqLoyJwpEojE4pM4wLwlBwlBg3Lo9L4zH4sI46GonHouG4zHgzIglKwwDg2E4hG4zHgkDwpE4_QguXojEouGwwD4hG4zHg3Lw8MwhXwwDw0Gw7F4wLw-Bg9Do4BojEo1FgwMo9Loqc4rBwwDo4Bo8E42D4-Jw3Cg6HwlBoqDo4Bg2Eg3LwjlBgmRo13BogI4yZwwD4wL4kCw0GgZoxCo4a431CohPo0wB4qT4p-Bw_I49boiWgw-Bo5Ig1WgvF4iNozQ47mBw4JopVwjMwzYoxC4oFg2E4-JonHovNoiWg0oBg7O4yZwrSw3bg4Sgya47No-SgoGgzIojEwiFwpE4oF42cgljBopnCov4Co1FghHwhiDop5DwyRg8V4sIorKgrC49C4uWg9cgkDwpE42D4oFw7F4sI4lJw8M4-J40O4tPg1WogIo2MglKwgQgvF4lJw7F4-Jg6H47Nw9TgljBoxCo8Eg9DgoG4hGokL4oFgsJo5I4tPouG4wLg2Eo5Io9kBohhC4sIooOo0wBw40C4lJg7OgjV4zgB4jU4vdgiOgxTo5Ig3Lg9DwiFwiFw0G4tPo-Sg7Og_Ro8Ew7F4sIglK4sIw4JgoGwtHwmIoyJgkcwtgBo2MwuOoyJokL4rBgyB44RowUgpNg0PoqD42DoyJokLorKwjM4uWo_Zo0X49bohPg4SwlagsiBgtQg1WowUo1egrbg4rBwjM48UwyRoufolS4liBwxK48U4zHwgQwpEw_IglKo7WwyRo6oB49CghHoyJ45YozQo3sBwkToq1Bw1mBgzsD4nXwgiC47NovmB4tPwyqB49bg9uCw9Tw73B4oFwnPg1oCg9rGwmIguXogIopVozQgtpBo0Xo82B4qT4toB48UgtpB41V40nBwlB4kCgmRg2dwmI4iNg6HgwMw4J4tPg6H4pMwjMolSwoWgzhBw7Fo5I4pM4qTgvFwmIgvFogIg6Ho9Lw1NowU4lJgiO4_Q4yZw-B49Co3Twie42Do1FgkDo8EgvF4sIgvF4sI47Nw2Uw-Bw3Cw_hBoq1BwzxBojvCgpNg8Vo2MowU4qTo1eg2Eg6HgoGwxKwxKw5Q4wLg4Sw7F4lJg_Rwpd45YwunBguXgpmBg9DgoGgoGw4Jw6Xw1mB4oFgzI4sIgpNo8Eg6Ho1FgsJo3TghgBgkDo8Eo6P4yZgk1B431C4p-B4ykDguXwmhB4zHgsJ4qT4uWwmIo5IwqLg-Kw4JgzI4zHgoG4lJghHw4J46Gw4JouGoyJo1FwuOg6Hg7O46Gg6HgkD4lJgkDglKoqDovNwwDw3C4SoxCwMw0GwlBorK4rB43Kofw_IwMo1FnGoqDAgkDA42DA4tPvMosR3SwgpBvlBgya3S4wL3SgmRvMgrb_YwqLvMwyRvM4vEnGojEnGowU_Yw7FAouGnGg3kBvlBwkTnGo8EwMg2dw-BwnPw-BgzIgyBw0G4rBg9DwlBg9DwlB41VouGwwDofoxCofgwMg2E4sIgkDo8E4kCwgQonH40O4zH40OwmIo8E49Cg0P4-J4pM4sI47Nw4Jg0oBg2dohPg-K46fg1W4iNoyJgoG4vEg0oB4vd4oFg9DoxCo4Bg7nBojdongBguXoivBw_hBgzI4hGg_R4iNwrSw1Ng2EoqDg0P4wLo2-Bw9sBo1FojE40OorKw8MgzI4-JgoGowUg3LgiOonHo3Tw_I4-JojEg2Eo4Bw5QgvF4_Qo8EwjM49C4lJw-Bo3Tg9DwqLw-B4ktCo9Lg2EgZg9c4vEgjV49Cwx1Cw8Mo2lBgvF4oFgZwpE4Sg6yCovNgiO49Cg-jB4-Jo-S4hGg2dwqLgmRwtH44RogI47N46GovNghHgvFoqDo6Pw_Iw8MwtHg2E49C41Vw1No-SwjMg-KghHg_RwjMgxT4iNo1Fg9DgwMwmIwhX4tPw0G4vEw-B4rBw-B4rBgkDw-BwgQ43KwyRg3L4wLg6Hg_RwjMg3kBwzYozQokL4hGojE4oFwwDw7Fg9Dw-BwlBw0GwpEohPglKouG4vEwxKghH4_QwqL4zgBg8VwxjBo0Xg9Dw3CwgQ43KohPglKo3T4iNo6oBgrboqDgrCoiWwnP42Dw3Cg7O4lJw4JouGgpmB4yZg5ZosRw0fopV4sIo1FgoGwpEg1W4tPwyR4wL41V40OwyRg-KoiWgwM4oFw3CowU4-Jo5I42DwxKojEw3CofwpEo4B4hf43Kw6XonHo9LwwD4uW4hGorjBwxKw_IgrC4oeorKggZoyJwjM4oF4zHwwDgzIojE49bwnPgxT4pM4nX4mQ4qTohP4tPw8Mo6P47NohPwuOg7OwnPw0GonHw7FouGogIw_IowU45Y47Ng_R4_Qw6XwxKwnPo7WwqkBwvVw8lB43Kw2U4iN4rawqL4gYw1NwtgB43K4kbo6Pg_qB4oF4tPwqLwqkBonHotY4lJg6gB4wLolrBw2UwwuCg6gBws9Dg3L48tBgsiB4hjEwqLosqB4iN4uvBo5IojdouG48Uw7FgmRwwDokL40Oo6oBojEwxKohPgwlBoyJoiWwjM4kbglKowUwjMgnYgkDgoG4vd490BohPggZ4oFwmIghHg-KwqLozQ49C4vEoqcgpmBgiO44RowUgnYw2U4nXo_Z4kbw2Uw2U4gYg1Wg_Ro6PwoWg4Sw4J4zHo5IghHghHgvFwoWozQwrSo2Mg-KwtHohPw4Jg7Ow_IoxCgyBg-KgoGgoG42DozQ4lJouGgkDgtQ4sIwyR4sI44RonHg3L4vEwjMg9Do5IgrCgpNgkDorKw-Bo1Fof47NgyBgoG4SwqL4SglKoG4zHnGgtQ3rBgzInf44R39ConH_xBokL39Co1F_xBo-S3hGg4SnnHomZ_9Kg6HnqD4mQnnH4iNv7F4gY3-Jg-KnjE4mQ_uFokLnqDokL39CwnPnqDg4SvwDo9Lv-B4vd_8Dg7O_xBwoWnxC4ravwDg2E_YwvV32DguXn8Eo8dnnHg2d36GotYv7FgsiB3sI4kb_nGgzIn4Bo4a3vE45Yv3Cgve_qCorKvMoiWoG4pM4SouGoGwoWo4Bo-SgrCwnPgrCoyJgyBoyJw-BgwM49CwxKgrCgoGgyBgvFgyBw1Ng9Dw2UouGw0Gw3Cg1W4sIw3CwlBg2Ew-BgoGoxCgnYg-KwiFw3C46GwwDwvVg3Lw9TglKogI4vEo9Lw0GgxsBotYg6H4vEo3Tg-KghHg9Dw2UwqLoogCwxjBg4SglK4_Qw_I4mQg6H4jU4sIwjM4vEw1NwpEw8MwwD43KoxCo5Io4B47NgrCgxToxC4iNgZ4sIwM4-JAoyJvMolS3rBgtQ3kCg-Kv-Bo9LnxC4qTviF41V_gHovNviFg39B35Y4t3Gvq2CwnPv7Fg_R_nG4tPn8Ew2tBnvN4rangIwvVnuGo2-Bn-SgofnyJginBn2Mw6X_5HgqUv0G4nXngIgvevxKg2E_xBoyiB3pMw7F3kCg-jBn2M4jUnnH4rB3S4lJ_jD41V3zHw7F3kCgkDnf4zH39C4pMvpE4xSv0GwiFv-BgqUnnHg-KnjEg-Kn8EwgQvmIo6P_rJwjMvmIgiO33K4zH_nG40Ov8M4zHvtHo2Mv1NwxK3pMoyJn9LgpN_-RozpBv_6BwunB_n4BoonBv04Bw-a3imBgnxBnwmCw8M_-RgoG_rJg-K3tPwnP31Vw0G_rJ46Gv4JokL3tPogI3-JgzInrKouG_gHokL_2Lg-KvxKwjM_9Kg6Hv0Gg7O33K42Dv3CgoG_8DgiO_yIgzI3vEw8M3hG43K3vEw0Gv3CgpNnjEgoG_xBolS_8DorK3rBwnPv-BotY_xB42DvMw8MvlB4hG_YwsZ39CgqU_qC4kCnG4liB_8D4shBvwD4pM_xBwmInfo2Mn4B4-Jnfw9T3kC45qC_5H41nCngIgxTv-B4qT_qC40O32Do5InxCo9L_1Eo5IvpEgvF_jDglKv7FwqLngI4hGvpEw7FnjEo1FviFokL_9Ko8E3oFgzInrKgoGnnHgoGngIw_I_vMw5Qn1e46G3iNw5Q_2kBoxC_uF4rB_jDg9DnyJ4oF33K4zH_sQwpEngIgrCvpEwtHn9L43Kn6PwtH3lJojEvpEgzI_yIonHnuGw8MnrKwtH_uFovN_9K4oF3vE48U_sQwlav2Ug3Lv_I4oFvwDo1F_jD4oF3kCogI3kCo1F3Sw7FnGo4BoGwpEoG4oFgZwiFgyBwiF4kCokLw0GgvF42DgiO4wL46Go1Fw9To6PwmI4hGwmIwiForKgvF4wL4oF4zHwwDg-Ko8Eg2E4kCgqUgsJwnPw0GwrSogIg2Ew-BwtH42Dg9Dw-Bo1Fw3C4wLg2EowU4lJg5yBg1W4lJwpEgrCof4vE4kCo8Ew-BoxCwlBouGw3Cw1N4oFglKojEwiFo4BgqUgoG4zgBgzIwlaw7Fo1FgyBo6zDgkc4pMoxC4_Q4vEwoWgvForjB4sIo2MgkD4sI4kCg6Hw-Bo3To8EgtQg2Eg2EgyBg0Po1F4pMwiFgnYwqLouGw3Cwwcg7OoufwnPgwMouGooO46GwjMg2EorKgkDo1FofgvFofw4JgZg6HA4sIvMwtHnf4zHn4BgmRn1Fw_InqDg4rB3tPokkB_oNw7iE31uBwjMvwD4wL39C4lJ_xB4ranqD4pMnfgwM3rB44R_xBotY_qC4xS3rB45YnxCgwMn4BorK_xBw1N_jDoqc_5HwuOvpEoyiBv4J421B_zPorKnqDwqL_jDginBnkLo0X36GghHn4B46Gv-BozpB_9K4zH3kCwmIv-Bw8M39C4sIn4Bw7e36Go9L_qCwtgB36Gg3Lv3Co8Enf4jU3vEg8uB_kKwiFnf4oFnf4SAorKn4BwjMv-Bw_I_YwmIAw7FAgyBoGojEAgrCoGwlBoGwlBoG4pMoxCouG4kCgzI42DgzIojEo5Io8EwtHg2Ew7FojEwmI46GgiOwqL4-iBg9cg_qBg-jBw-BgyB4kCo4BojEwwD4zHghHg2Eg9Do2MwxKo6Pw8MgzIonHozQ47N43K4sIo5IghHwmhBwwcg2Eg9Dg6Hw0GgmqBorjBw9TozQwnPo2Mw7FwpEwtHw7Fw3Co4B43KghHw7FoqDo1FoxC4oFgrCg2Eo4B4oFw-B4vEwlBovN4rBo1FoG40OAw0G_YgsJ_xBw0G_xBghH3kCo5InqDwiF_qCw3CvlBg6HnjEw1NngI4-J3hG4sI3oFo9L3zH48UvuO4_Qn9LggZn-SwxKv_Io3TnsR49bntYgxT_-RgrC3kCwiFn8Ew4J3lJozQvnPw7Fv7FonHv0GgzI_5H4xSnzQwxK_rJ4nXv2UwmI_gHolSn6Pg1Wn3TgZ3SwuO3pM4vEnqD43K36G4zHnqDghH_qC4vE_Yw0G3Sg9DAgoG4S4vEofoyJg9DgwMo1FwtH42DwiFoqDw3Co4Bw7Fg9DgiO4lJojEg9D46Gw0Gw_IgzI42DwwD44qBwunB49CoxCojEwwDwlBofghH4hGoxCgrCw4J4lJ4kC4kCgkD49C4sIogI4zHgoG4zHouGg3L4sIg6Hg2E4zHw7F4hGo8Eo8Eg9Dg2Eg9DwiFojEoxC4kCo8EojEg-K4sI4hGwpEo4Bofo1F49CouGnqD4kC_qCw-Bv3C4sInwUgvFv8MofnxC4lJniWgoG3_QwMvlB42DnvNwwD30Oo8E3nXoxC_vMgyBnuG49Cv1Ng2E3qTo4B_gHwwD33Kw-B36GorK_jc49CngIojEvqL4vE3pMgoGv5Qw3CnnHw3C_5Hof_qCwlBnqDgZ3kCvM39C4SnjEofv3CgyBnxCoqD3vEoqD32DooO3wLojE32Dg2En1FgkDviFw3Cn1FgyBnjEg6HvpdgZ32DgZ3hGvMnkL3rBv5Q3SvqLgZnpV4S3pMoGvgQnG_wTwM3vEoxC4So4BAwwDoGgkDo4B4kC4S4_QwpE4oFgZgvFnGwwDvMgrC_YwwDnfojE_xBg3L_1EwtH_jDofghH4rB4sIgyBo2MgZ4oFofgsJwMg2EwM4vEoGwlBoGgkDoxCowUwlBokLgZ4pMoGorKof4qToGgrCoGg9D39CgyBnxC39CvlBv-BvpEvxK3rBviF_Y_uFnB3hB_E_mEoG_1E4rBvtHgkD3-JgyBvwDw-BnqDgyB_YwlBokLgZ4pMoGorKof4qToGgrCoGg9DoG4sIwwDvMw-BvMgzI3kCw7FvlB4oFw-Bw-Bofw-B4rBw3CoxC49CwpEgyB49C46G4tPgvF4pM4hGgpNwwDg6H4rBw3Cw-Bg2Eo1FgwM46GooOgyBoqDoqD4sIgvF4pMgvF4wLwwDonHo4Bo4BojEw4Jo5IwkTw-B4hGgrC4hGo4BgoGo4BwtH4rBgyB4rBof4rBoGw-BnGgrCv0G4kCv7FgyB_8DwwDv0Gg2E_rJg2En5Iw7Fn9Lo8E_2Lg-KnwUw-B32DghHvjMwwD_nGoyJnhPoxCnxCg9D3hGgrCvpEoqDv7Fo1F_rJgrCgkDwlBgyBgyBw-Bo4B4kCgkDwpEojEgoGgyBgrC46G49CojEwlB4kCoGw3CwMw7FAw3C3rB4kCnGg2E3S42D3SgZnGghH_xBgZnGofnG4kCvMgyBvMg2Enf4_Q_jDgsJn4B49C_Yg2EvlB42Dnf42Dnfw3C3rB4kC3rB4_Q_9KglK_gHwzYv5Q42DnqDw9T_oN4vE_jDg9Dv3C4sI3hGowUvuOomZv5QwvVv1NouGvpE42DnxCoxCn4Bo8EvwDgoGvpEgZ3SgkD_qCoxCv-Bw-a_7Vg8V_zPw-B_xBw7FvpE4tP_2LgsJ_gHgrCn4Bo2MnrKojE_jDgoGnjEogI_uFogI_nG4pM3lJwwDv3Cg6Hv7FgzIv0G4vEnqDo8EvwD4vEvwD42DvwDwiFvwDg9DnqD40OvqL48Uv5Q42Dv3C4lJ_gHwwD3kCwpE39Cw_Iv0Gw9TvuOo1Fn8E4rBv-BoqDvpEgoG_2L4rB_qCwwDvtHgzI3xSgrCnjEw-BvwDoqD3vEwiFn8E49C_qCg9D_qCgrCvlBo1F3kCg8VnnHo_Z_yIgiO_1Eg-KnqDw7F3rBw7FvMo1FnGgvFoGw0G4Sw7F4So1Fofw-B4So1Fo4Bo8Ew-B4vEw-BgZoGghHw3CoxC4rBvMvvVoG_uFoG_qCwlBvtHoGvwDgZ32Dof3oFoqD37Nof_1E42DnyJo4B3hGw7FnwUoxC_5H4kC3zHoxC_oNwwDoxCg2EgkDoqDw-BogIo1F4kCo4BgsJ4lJg0PwrSgvFw0GwiF4hGo3T45YgofoonBw9T4yZwiFghHojEo1Fo5IovN4-Jg7O43Ko6P46GokLgkDwiFwwDgvFg9D46GgkDo8EonH4wLojEgoGonHwxKg9Do8E42DgkDouGoyJw3CwpEwiFwmI4vEwtHw0Gg-KgZ4rBwlBgrCw3Cg9Do2MgqUwlBo4B4oF4sIo4Bw3CoqDwiFw3CwpEw7F4lJogIgwMw4JwgQghH43Ko8EgoGgyBo4B4kC4kC4oFwiFg2E42DwiFgkDwpE4kCw3CwlBofwM4hGw3CokLwiFoqD4rBo8Eo4B4kCofwlBwM49CwlBwwDwlBg4S4lJo4BwMw-BAgZnG4rBvMwwDnxCgrC_qC4vE3hGw3CnqDo4Bn4B49CnxC4kC3rBo1F32DwpE3kCghH39CogIv3Cw4J_jDwlBvMofvMo8En4BgmRn1Fo9LnqDghHvlBg_R3rBorKvMgvFwlBgjVgvFg-K49Cg9D49Cw7FgrCojE4rBo9Lw3Co5I4kCw3C4S4kCoGw3CnG49CvlB42DnxCw3C39CgyB3kCwlBn4Bw-B_8D4kC3hGwlBn1FoG3kCnf37Nnfv0Gnfn8E_xB_1En4BnqDn4Bn4BnGvlBvlBv-Bnfnfv-B_xBnxC_Y_jDoG_jD4SvpEgyB_jDgZv4JgyB_rJ0jB3oF0UnoOo4B3pMwlBnqD4S_xBoqDv3CAn4B4rB3rBoxC3oFg_R3Sw3C3SwiFAgrCwMgkD4kC4vEw3Cw3Cg9DwlBo5Iw-B44R4vEo4a46GwqL4kC49CoG4vEnGowU_xBo2M_xBoqD_Y42Dn4Bg-K_YoqD3Sw0G_xBouG3kCgvF_qCwmIviFg9D_jDwpEvpEwwDnjEgkDvpEoqD3oFw3Cn8Ew3Cv7FoxC_nG4kC_nGo4Bv7FgrCnyJ4kC_oNgZ3lJoGnnHA_yIvM_5H_YvtH3rBv_IvwDvnPviF_wTvwD3mQvlBngInfv_I_YnrKvMnyJoGvxKwM_yIo4Bv5QoxCnhPw-B_yI49CnrKoxC3zHgrC_nGwwDngIofn4Bg2E3lJg2E3zHw-BvwD4vE36Gw3CvwDg2E_uFg6H3sIwhX_pUolrBn9kB4vE_8Dw7F_1E4rB_Y43K_uF4hG3kCo1F3rBgsJ_qC4hG_qC49Cv-B4hGvpEw-B_xBgZnfg9D_8Do8En1FgrCvwDgkD3oFw0Gv1NoxC3vE4kCv3C4kCv-BoxC3rBgrC_YgrCAgrC4S4kC4rBw-BgyBw-B4kCgyBoxCwlBoxCof49CofgkD4S49CnGw0GvM42D3rBw0Gnf49Cv3CwiFvwDwwDn4BwlBv-B4S_8DoGv-B3SvwD3kC_xB_xB_jD_8D_uF33Kv-B_nG_Y_jDvpEnhPv3C3lJnxCnyJv-Bn1Fv1Nn-rBvwD_2LvqL33jBv-B_nGnoO_spBvpE_vMnjEvjMn4Bv7Fv-Bn5Infn1F3SnuGAvzYoGnuGwlB_ptBo4BnwUw3Cv2UwwDnwUw5Q374Cw_In7vB4oFnxbozQ_gyCgzI_lqBojEv9TwwD_sQwM3kCgyB3hGw-BngIgyB_gHof3wLwMnnHnGvpEvlB_5H3kC_yIv3Cn9Ln4Bn5Iv-BnvNnxC_pU_1Ev9sB3S3hGvM_jD3rBvmInqD_-Rv-B_yI_1EvrS_kK_2kBvpE_zPnqDn9Lv7FvoWn8E3mQvpE3iNnqD3-JnqD3-Jv3C_5Hv-BAvtHoG3wLnG_1EA_1E3SnxC_Y39Cn4Bn4Bv-Bn4BnqD3S_qCnGnjEoGv3CofnqDwlBv-Bo4B_xB4rB3S4kCvM4oFoGo8E4SwjMg9Dw3C4SgrC4SglKgrCw7Fofo5IwlBghH4S4oFwM47NwM4xS3SotY4SgnYw-BorKo4BorKo4Bo9LgrCotY4oFwyRo8E4qTouGonHoxCovN4oFwjM4oFg3kBwyRo5Ig2E4iN4zH4lJo1FomZwgQg6gB4uWgoGg2EolSw8Mg8V4tPolSw8Mo8dowU42DoxCogI4oFw8Mg6HgoG42DwiFgkDw_I4oFo5Io8EoxC4rBonHojE43Ko1FgrCwlB44Ro5IoiW4-Jo1ew8MwyRw0G4xrB47N44Ro8E48Uo8Ew5QwwDgqtBg6HgtQw-Bg6HgZ4plBo4B4_QAomZnf4mQvlBwoW_qCwxK3rB4uW32DgtQnqDwyRnjE45YnuGwqL32DwoWvmIo2MvpEghHv3CowU3zHwvVv_I4pMn8E49bnkL4iN_uF4vd_2Lg8VvmI4-J_8D42cv4JgjV_nG4mQvpEwtHn4BojEnfgtQvwD48UvwDw4J_xB4uWnxC48U3rBw3CA4uW_YgjVwM4pMgZwmI4SgmRo4B4lJofwiFgZwmI4rBghHofonHwlBw_Io4BgwMoqD4jUo8Eo2MwwDotY4zHwyR4hG4yZw4JgoGgrCginB4_Qo3T4lJwxKwiFonHwwDw7eohP4uWg-K4iNouG4vd40O47Nw0GwhXg-K4xSwmIghHgkDw0Gw3Cg0PouG4kb43KwpEgyB49CwlB4_Qw7FgzI49C4wLwwDg6HgrCo-So8EgiOwwDwxKoxCo5IgyB43Ko4BgpNgrCgpNgyBg3LgyBw5QgyBwvVwlBwyRwMwgQvMwoW3S4tPvlBgvF3SgoG3Sw3CvMgvF3SgqUv3C4oFnfw9TvwDwkTvpE44R3vEwjMnqDwtH3kCgpN32DopVnnHotYn5Ig0oBvgQwoW_rJ4oenvNokLn8EwzY_9KwqLn8E41VvxKgxTn5Iw0G_jDo9Lv7FosqBv9T48UvxK4_QngIw0fvgQopV3-Jw4Jn1Fo-SnyJwi3B32cw1Nv0GgljBvkTwlav1N4zHnjEwkT33K4oe3_Qo0X3iNwxKv7FokL_nGg6gB_3SwrS_kKgvF_jDwrS3-Jw_I_1Eo3TvxKg3L3hGovNvtHo4Bnf4lJ3oFgxT_rJojEv-B4hG39CgsJ_1E4vEv-B47Nv0G4mQvtH4xS3sI46f3iNwlav4J44R3hGo9LnjE4uW36Gg3LnqDg_R3vEgqU3vEwrSvwD46GvlB49C3SgsJ3rBwyR_qCoyJ_Yw5QvlBw4JvM43KvMgjVoG4kbofg9DoGwiFwM4-JwlBo1F4Sw0GgZo0Xg9DwtH4rBwyRwwDomZouGg3LoqD40Og2EwqLojEg4SonH46GoxCwrSg6H4iN4hGwvVg-KwwDo4BglK4oF4mQoyJw4JgvFwyR4wLgvFwwD4mQwqLw6XwyRgzI46Gg7Og3LwxK4sIg3LgsJo7W4qT4_Qg7O4_QooOgtQwuO40Ow8MgoG4oFg9DoqD4sIghH4nXgxT4lJ4zHokLw_Ig-KgzI4sIw0GotYg4SgtQwjMw3bo3To7W4tP46GwpEw3bwgQgrbwuOwjMw7FgtQwtHwuOgoG4hGgrC4lJoqDomZ4sIwzY4zHwsZ4hGggZo8EwnPgrCo6Pw-Bg_Ro4B47NgZolS4S4xSAooOvM4mQvlBg1W_qCg7Ov-B45YvpEw-a_nGgpNvwD4iN_8D4k0Bn-S4uWv_Ig-Kn8Eoxb_2Lo0X_9Ko9Ln1FooO36Gg8VvxK4qT3lJ40OnnHwjMn1FgtQ_5Hgvev1NgjVv_Ig4SngI4pMn8EgsJ32DosR3hGgsJ39CgtQ3oF44Rn8Ew_I3kC4-J3kC4pMv3CogIv-BokLn4BwiF_Yo1F_Yo7WnxColS3rB49CnGoiWvlBgsJnGgoGAwgQ4SonHAglKgZo4aoxCwxjBgvF4xSwwDgrb4hG4gYw7Fo-S4oFwlag6Hw1NwpEg9coyJgwlBovN4oeo9LokLo8E4qTogIw-aokLwmIwwDor8Bwla4zHgkDowtBw9TwkTogIw4JwpE4_QwtH4v2B41VgoG4kCg9DgyBoxCofo5hBo2MwoW4zHg1WwtHwvVouGwvVw7Fo-So8EghgBghHw7FwlBwnoB46G4kbwwD4plB42D4sI4Sg8VofggZ4SwxKoGwkTvM4ranf4mQ_YwwcnxC4mQv-Bg6gB_1E41V32DwnP39C4vE_YosR_8D4xS3vE4pM39CwpdvmI4pM32DgmRn1FwkTv0GgzhBn2Mg4S3zHwmI32DovN3hGw9Tn5I4jUnyJo9L3hGg4S3-JohP3zH4v2Bn8dw5Q_rJgpN_gHgsJ3oF4o3B3oeoyiB3xS4mQn5IoghBnzQg4S_rJ40O36G4vE3kCo4a_vMwjM3oF4wLn8Ew4JvpEwpEn4BwzYv4JwnPviF42D3rBgoG3kC4vE_xBg9D3rBw0G_qCwrS3hGgvFn4B4oF_xBgkDnfo1F_xBo5InxC49b_5HorK3kC4oe3hG4jUvwDolS_qCg7On4B4mQ_xBo2Mnfo-SnfwmInGg-KnGomZAgkcgZopVgZosRwlBwlaw-BglKwMoiW4kCoufw3CgyagyBg2do4BoufgZomZAw4JvMoghBn4B4sI3Sg3LvlB4-JnfgnYnqDo0X32D4-Jv-Bwie3hGotY3hGo-S_uFw7Fn4BwpE3rBo4B3SwkT3hGg4Sv0GoqDvlB4_Q3hGouG_qC42D3rB4zH39C4rB3SgwMviFgtQ36G4hGv3C4yZ3wLgpNn1FouGv3C4rB3SojEv-BgrCvlBwugC3vd4oF3kCwwD_xBgmRnnHgmRnnHwkTnnH4liB3pMosRviFwgQ_1EoqDvlB47N_jDgtQ_8D4xS_jDokL_xB4oF_YorKnfosR3rB4wL3S4hGnGogIAo2MoGg8VgZ4vEwMo2MwMgsJofo9LwlBwmIwlBwpEwMw4JwlBwpEgZ4-JgyBw4J4rBw_I4rBosRgkDo4BoG4jU42Dw1Nw3Cg5ZgoGw9TwiFo2M42D4jUw7Fo5Iw3CgtpBwuO4oFw-BggZw4Jw5Q46GoonB44R4gYg3Lo2Mw0GgtQ4sIw8MghHwqLgoGojEoxCgtQw_I4oeolS4lJgvFwwcg_Rw8MgzIooOgsJo5hB4nXw9sBghgBowUg7OgtQ4pMgpmBojd4jtBgsiBo2M4-JwwDw3CgljBgrb4yyBg7nB4sIouGgpNglKw_IonHgtQo2MgjV4mQwwDw3C46G4oFgvFwpEwpEoqDoxC4kCgqUwnPwnoB4vdorK4zHo5IouGohPg-KwmIo1FghHo8Eg2EoqDw7FojEglKghHghHg2E4pMwmIouGwpE45YozQo8EgkDgwMg6HoyJw7Fw0GwpEo_ZwnPgtQoyJgvF49Cg5ZooOgrbooO41V43K48UoyJgkcwjM4toB4tP47N4oF4oeorK4sIoxC40OwpE4wLoqDw7ewmIwlaouGw9TojEwpdgvFwkTgkDoxCoG4_Qo4BghHofw1N4rBg4S4rBg9DwMg6H4SgzhB4rB4yZvMwvVnf49b3kCgvF3SotYnqDwsZn8Ew6X3oF4nXv0G4uW_gH46GnxC48U3zHojEn4Bo1F_qCwwD3rB4zHvwDo9L_uFwtHvwDw_I_1Eo2MnuG4mQvxKgsJ_jDwlan9Lw0Gv3C4sI32DgpN3oFolSnuGw8M32D4pMnqDo7W3vE4pMv-Bg7O3rB4yZ_YwoWofg5ZwwDgiOoxCgkcwtHg1WwtHo-S4zH4iN4hG41VwxKwrSglKw5QorK44Rg3Lo2Mw_Iw6XwrSgjVosRopV4xSgqUgxTohP4tPwxKokLgxT41V40OosR40Og_RwnP4qT40Oo3TongBg8uBg-Ko6PwqLw5Q4oFgzIgtpBolkC4xSw0f43KwkTgkcwsyBgjuBo5zCongBw_6BgqUg3kBosRw7eosRo8dw2Uw4iB48UoyiBgpN48Uo2Mo3Tg6Ho9Lo6P4nX42DwiFg5Zg-jBw-Bw3CwgQw9T43K47N4vEo1FwmI4-J4sIoyJgwMooOg3Lw8MozQgmRo5I4sIo-S4_Qg-Kw4J4qTwgQguX44Rw5Q4wLw_Iw7FwrSwqL45Yw1Ng-KgvFosRogIoiW4lJ4zH49CohPgvFou4Bo3T4mQ4hGo8Eo4BwgQgoGokLwiFonHwwD46GwwDooOghHohPogI4iN4zHozQorKgiOoyJ47Nw4JgnY4xSorKo5IgtQooOozQ4tP4pM4pMw4JorKgzI4lJ4liB47mBwieo9kBw3bgzhBw6Xw3bwjMovN4-JwxK4qTgxT41VgqUoiWo-Sg1W44RwrS4iN4zgBgjVo2lBowUo-So5I4qTg6H40OgvFgya4sIwyR4vEwuOgkDwkTwwDo0X49CozQofo4BoGo-SgZwrSnG42c3rBo3T_xBo0X_xBwnP3SwmhBnfgjVgZ4iNofozQo4B44Rw3Cw1NoxC4uW4oF4oFgyBgsJw3Cw4Jw3CowUghH4hGoxCosRonH4uWorKwoWokLgpNonH4-Jw7FwxK4hGw8M4sIozQwqL42DoxC47NgsJwiF42Do1FojEg-jBoqcw7F4oFosRg0PwqLwqLgiO40Og9D4vEouGwtHwwD4vE4oFouGorKg7OorKw5QgkDo8E46G4iNg6Hw5Q4zH4qTo1FwgQ46GwzYwpEgqUgrCo2MgkD4jU4rBg3LofgwMofw8Mo4Bg1W4rBw5Qw-Bg1WgyBovNofgsJgvFwqkBwwDgmRwtHghgBwtH4rao4BgoGwjMwxjBoqDgsJ4sIg1W47NohoBw3Cw_I4rBojEwiFolS4kCg6H49C4pMoxCgpNw3C4_QgZgoGwMg9D4rBg3Lw-BotY4So9LwlBwzYAouGnG4-JvMw3bnGwxKvlBwqkBnfwvuBvM4zgBoGo-SAw-BoGg2EoG4sIgZg7OgZovNgZwqLgZohPAg6HnG46Gnfg3LvMgsJoGglKwM4hGgZg6HgZghHgZg9D4rBw7F4rBwiF4sIgyaofoxCwwDwxKw-B4oFgrCouGgrCghHg3Lg2dw0G44RojEg-Ko8E4iNo8EgwMwlBoqDg9DgsJofw-B4lJw9T4rB49Cw_IgxTw-BwpEw3C4lJwpEwgQof42DoxC4iNgyB4-JofwpE4S4kCoxC4lJwiFgiOo8EgzIwwDgvFnuGomZv3CokL_qC4lJAwpEnqDg3L_YwwD3rBw0GvlB4oFnxCorK3rBwwD_xBw3CvwDo8E_8D4vE_8Dg9D32Dw-B_YgZviF4oFn4Bw3C39C4hGv3ConH3SgyB_Yo4B_qC46G3rBwwDnxC4zH_YoxCn4BgvFnxC3kC32DnqD_vM_kK3yFzsEnrFrmEnuG3oF_qCv-B4vEvyR4S3kCnf_Yn1FnjEv4JnnHn4BvlB_yI_nGgkD_oNojEv5Qw3C3wLgZnqDg2E_-RgkD3wLgkD3hGw8M_iVw3C3vEwiF3sI42DnuGojE36Gg9DnxC42DnxC4pM_gH4iNvmI4vEnxCo8E_jDgyBnfgkD3SoqDnfw3C3rBvlB_8D_8DnoOvwDnkLv-B3vEnjE3lJn8E_9K3rBnxCv7FvjM_8DngI_Y_xBn8En9L3oF3iN39CngI3hG3mQv7FvgQ_vM3hf_xBviF3rBnjE_8D_2LvwD_2L36Gn7W3rBviFv-B_rJn4B_rJnf_gH3S3wLAvpEgZ_mYwMvtHnG3-J3S_rJ3rBv2UvlB_qbnG3lJA_YnGvvVoG_1do4Bv8-B4S3jUoGnyJwMvlaAnyJnGv8M_Y3qTvMvqL3S_gHvM36G_xBvuO3S_nGn4Bv8M39CvyRnqD3mQvlB3vEnqD_oN_1E3_QvpE37NnjEvjMviF30O36Gn-SvxKnjd_1E_oN3zHvhXviF3_QnjEn6PvpEnlSvpE31Vnf_uFn8EnngBv3CvhX_xBnlSnxC_5gBvM_nG3SvmI_Y_rJvlBnrK_YnuGvlBn5InxCn1e3kCvnPnxC_6On4BngI3vE3_Q_jD_kK_xBn1Fv3CvmI3zH3nX_yI__Y_nG38U3vE_lR_jD37NnqD3_Qv-B3iNvlBn5In4B_wT_Y3lJ3kCnonBn4B_vlBnfvoW_YnpVvMnkLvM3zHvM_5Hn4B3xrBnfvzY3rB3-iBv-Bv73B3kC_u3BnGnkLA3hf4S_9jBgZ3iNo4BvoWgrC_0W49CniW42Dn7WojE_7VwwDnzQ4hG35YgoGn7WwmI_qbwpE_oNwtH31V4wLv0f4qT3gxBw6X_g5BolS3qsBoyJ3gYwuOv8lB4sIn0XonH31V4-J3hfw8M_wsBwxKvunBw7Fn0X4lJn6oB46G3shBo8EnmZ4oF36fgkD3qTwiFnyiBgrCnsRojEv4iBg2E3xrB4oF_98Bw-Bnxb4kC_9jBoxCnu4B4rB33jBwM38UwMvnPwM3xS4S390BnG_xzBnG_1d_Y3vdnGnhP_Yn3Tn4BnmyBvMvtH_qCn3sB_xBn8d_xBv7evwDny7B39C3o3Bn4BvqkB39C_12B_1E3p-Bn4Bn-S3vEv1mBnjE_1dviF36f3oF39bviFvsZnjE_3Sv3CvqLv0Gnqcn1F3kbnjEn-S3lJvgpB_qCnkLvtH_kjBnxCv1N_jD3qT32Dn4a3kC_6O3rBnrKn4BvnPvlBvxK_qC35Y_qC3hfv-Bv_hBn4B_xzBvwDvl-D3SvjlBAnpuBoG3iN4kC_r7BgkD3gxBw3CvjlBwwD31uBgrC3zgB4lJv50DgrC39b42DnzpBw-B_-R4rBvjM4oF3imB4rB_yIoqD38Uo5In4zB42D31V4sI3nwB49CvrSgvFv5pB49CnmZwlB3pM4kC35Y4rB3ra4rB3toBoGvzYnGvgQnGvnPvlB3hfnG3sI_Y_hO_qC35xBnf_iVvlBv6XvqLnrrHnuGvqoEviFvy8C3vE3l7BnjEv5pBnuGvi3B_rJ30gCviFnuf_5H_iuB32c30kF3hGv_hBvie3ntFviFvpd3vEnmZnrK_55BvjM_zhC_9Knu4B_gH_9jB30O3qlC39Cn2M_Y_jDv7FnmZ3rBnuGvM3vEnxC37NvwDnlSvwDnxbnfnhPoG30O4rB_hOwlBvtH4rB36GoqDn2M4kCv0G4oF3iN49Cn1FwtH_9KgsJvqLgoG3hG4-J3lJwiF_nGo4B_xB46Gn1FojEvwDghH_nG4vE_8DwwD39CogIv0Gg2dnxbo8EvpEgwMvjMwwc_qb4hf_nforKvxKwrS3qTgwM_oNw5Q34RohPv5Q4oev_hB4mQ3xS46GvmIg2En1Fo3T3nXgrC39Cg2E3hGg7nB__xBoxCnqDw-B_qConHnyJ4zH_kKwjlB__xBoghBnpuB40nB_55BoghB3yyBg0P35Y45YvnoBg0Pn_Z4hGnrKgkD_uFg7O_4ZgvFv_IgyBnxC49CviF46Gn9Lw7F_kKw9TvxjBokL3jU4vEngIw7F_9K4vE3sIgsJnsRwmI3tPgkDn1FovNvzYo-SnrjB4xS_kjBghH3iNgkD3hG4_Q36fg9DvtHwiF_rJo8Ev_IgrC3vEw8M3gY48U37mBo-rBviwC4nX3mpBojd__xB42D_nG45Y3mpBo9Ln-Sw0GvxKg0P35YwmIv8MwgQv6Xg4S39bwtHvxKgqUvwcg3LnhPw3b3wkBouf_omBwkTnpVonH_5H4zH3sIgnYvsZgxTvkTwyR_sQwvV_3Sg7O3pMolSnoO4ra3qTg2d_pUgnY_zPwmhBnwUwunBn0X4ra3tPgsJv7F44RnkL4xS33Kw2Uv8MwgQ_9K44R3wLoxb_wT49b_iVw9T3mQ4pMvxKgoGn1Fo2MvqLozQ3mQg6H3zHwvV3nX4mQvrSwjMvnPgmRvvVgvFnnHgpN3xSorK30Oo1Fn5Io8EnnH4nX33jBwpE36GwpE36GgsJn6P47NvzYw1N__YogIvuOwwDv0Gg_R3liB4ran4zBg75C_u0Fojd_n4Bwiev73Bw8MvhXojd3nwBw7evovBgmRv6Xw2Un4ag7OnlSw1N_zPw5QnlSw9T_pUwoWv2UgxTnzQwgQv8MgwMv4JgqUnoO4iN3sIwiFvwD49Cn4BwpEv3C4xrB_xawtH3vEoqnDvq9B4vvC3uvBwtH3vE4uWnvN47_Bv1mB4uW37NwtH_1EovmB_4ZwjMv_IgqU_zPg0P_vMo7Wn3T4ra3gY4vdvpdwla_jc4jUn7W4xSvoWwjMvnPo-SvzY4wLn6P4gY_riBw2U_nfg3L3xSwnPvsZg8Vv8lB4xS_riB43K38Ugyanj2BgmR_vlBo6Pv4iBwsZvm6BokL35Yg8V_0vB4oF3wL47NvieonH30OwuO_1d4pM35YgkDn1Fw_InzQgvFnyJ4sInhP4hG_kKgvFnyJw_I30Og9D_nGgtQ_4Z4-JvnP43Kn6PolS3yZgoG3sIo5IvjMouG_5Hw7FnnHgkD_8Dw3C32DgyBv-B4vd_kjBw3b_nfg_qBvovBwien5hB4hfnkkBwqL37NooO3xSogI33K46f_wsBg_qBvnhC4-iB3v2Bg0oB_29B4ra3plB4wLvnPg_R3uWgoGngI46fvjlB4lJnrKo1F_nGwrSvkTgzI3sIw0fn8dw2UnsR42D39Cw_IvtH4mQn2Mgkc38UozpB_1dg0P33KoghBv6XoyJv0G43KngIg3L3lJwuOnkL4lJ3zH4tP_oNo3TvyRw0GnuGwtHnnHw_I_rJo1Fv7Fo0X3yZg7OvyR46GvmIwjMn6Pw0xCvipDo8dnrjB4iN30Ow1NnoOo9LvjMguX31V4tPnvNg8VvyRwoW3mQgmR_2LwxK36GwtH3vEw6X3iNwyRv_IgpN3hG40O_nG49b3-JwuO_1Ew8MvwD4pM39Cg6H_xBowU_8Dw8Mn4BoiW3kCo6P_YgwlBAwnPofgjVo4BgjVoxCgya42D4xrBonH421BoyJwqkB4hG4liBg2Ew6XgrCg4SwlBw2U4S4iNAwzYnfwnPvlBwla_jDglK_xBg3L3kCgtQnqDorK_qCwxKv3Co6P3vEwkT3hGo0X3sIg_RnnHw2U_rJgpNnuGolSnyJgjV3wLowU3pMwzYn6PgtQnkLw5Qn9Lw6XnsRgzhB_4ZgzhBv-ao-rB3wkB4imBnngBoy0CnwmCosR37N4wkBvwcomZ3xSwsZvyRoqc_3Soqc3_Qg0Pn5I48U_9Ko6P3zHo-S3sIozQ36G44R_nGwiF_xB4hGv-BgwMvwDgrb3zHonHn4BouG3rBwpEnf4tPvwD44qB3lJgsiBnnHwxjBvtHolkCvuOo9LnxCogI_xBgqUvpEwvV3vEg2E_Y4gjD_iVwiFvlBw5QvwDw7FvlBgiOv3C4jmC3tP4hfnnH4qsB33Kg22BvuOozQ_1Eo_yB3tPgzI_jDo1Fn4Bw5Q_uFwmhBn9Lw4iBv1N47Nn1Foxbn9Lg7Ov0GghHnqDo0X3wLo9L_nGw3C_xBw3b_hOw4J_uFgvenlSowU3wLg0Pv4JwpdvkTwvV_6OgzI3hG4mQ3wLg-K_yIw8M3-JozQ3pMowUn6P4jUnzQgiOnkL490B_wsBwllDvj3Cw4iB3vdo3sB_2kBgljBv3b4nX34RgiOvxKwgQ3wL4mQnkL4jUv1Nw5QvxK48U_vMongBvrSw-a_oN4ra3pM4lJ_8Dg4S_gHw5Qv7FowUnuGw_InxCgqUviFwvV_1Ew5Q_jD4nXnjE4uWvwDwoW_jDwm6BnyJgve36GgtQnjEg-K_jDo1Fn4B4mQn1F4mQ3hGg0Pv0GorKn8EosR_yIo-S_kK40On5IorKnuG40Ov4J4lJnuGgiO_kKg5Z3jUwtHv7FohPn2Mw4JvmIw5QvuOojE3kC4vEv-Bw3CnfwiFnfg9DoG49CgZgkDgyBw7FwwDoqDw3C42Dw-Bw3CgZw3CwMoxCnGw3Cnf42D_qCgvFnGo4BwM4rB4SgrCgrCwlBo4BoxC4oFojE40O4tP4v2Bw_Io1ewuO41uBwjMgwlBw8MgwlB4iNwjlBglKgrbgZw-BgmR4xrBo4a47_B4mQ4-iBgya490Bo9L4uWgvFw4JogI40OouGokLgiOo0Xw7Fw_Io5Iw1NwgQguXwgQwoWo5I4wLg6Hw4JgjVotYw8MgpN4iN4pMgpNokLwmIgoGw4JouG4iNghHgtQwtH43KwwDg7OwwDonHwlBwtHwMglKwMovNvlBgwMnxCgvF3rBglK_jDgmR_gHoqDn4B46G_8DgpN3sIwlBnfg2EvwDwqLnyJ40OnoOwjM3pMo5I3lJo8E3oFw_I_rJ4uW_mYw0GvtH4oF_1Eo4BvlB4kCnf46G3kCo4BnG4vEoGgvFofg2EoqD49Cof49C4SgkDAgrC3SoqDn4Bw3C3kCw3C32DgyBv3CgyB_8DwlB_1EoxCnkLw_Io8EojEo4B4zHojEghHojEw3Cw-B4-JghH4lJgoGg9Dw3CghHg2EoqDgrCw-B4rBw0G4vEojEw3Cw7Fg9D40OwxKgZ49CgrCoxCoxCoqDwlBw-Bg9DwpEwjMgmRg9Dw0GofwlBw-B4S4SgZ4kCgkDw3CwpEg9Dw7FgZwlBw3CwpEg9Dw7FwwD4oFw-BojEwlBg9D49Co2MoxCwxK4kCogI4rBogIgyBo5IoxCw4JgyBojEojEgzIoxCojEouG4-Jw-BojEofg9D4kCohPgrCo-SAwpE3rBgkDn4B4kCvpEw-Bv3CgrCv-BgrC3rBwwD3rBg3L3Sw4J_1E_xB_qC_Yv0G39Cv3C3S_xBAv3C_uFnlS3iN_nGvwD_yI_1EviFAr0CorKjnDo2M42cwkToqDofwMnqDgZ3kCwlBv-BwiFn8EgrCn4Bo8E_qCgyBAw3C4Sw0G49CgrCgZg2EgyBwtHgZgvFvlB4kC_Y46Gn8EgrC_xB42Dn4BgkDnfgkD_xB49CnxC4rBvlBw3C_qCgrC_Y49Cv3CgZvlBwMv-B4rB_xB3rBvpEnGv-B3rBviFnqD_6O_qCvqLnf3oFn4BvqLnGnxCnG_qCvM3hGAvqL_YnnHnfnnHn4BvmI3rB_nGn4Bv_Iv3C3-JnxCv0G3kCv7FnjE3wL_uFv5Q_xB3oF3kC_5Hv3Cv4J3hGvoWnjE_zP3rBn8E3kC_yI_YnqDv3CvxK_qCv4J3kCnyJvlB_gHn4BnyJnfnnHv-Bn6P3rB_6O_Y_zPnGvxKoG3mQofv6XoGnuGoG3zHwMngIoG_nGoGnhPn8EoG3kCnGnxCnGnqDvM_gHn4Bv7Fv3CnjEnqDv0G_nGnxCn1FvlB32D3S32DnG_gH4S_8DwlBnjEg2Ev0GovNn-SwxK30OwtHnrK4-J37NokLnoOg6HnyJogIv_I4sIn5Io5I3sI44R30O4lJ_nGgsJn1Fg6HnjEg2E3kCgoGnxCgsJvwDgsJnxCgsJv-BgsJ3rBoyJ3SgsJAoyJgZoyJ4rBgsJ4kCoyJw3Co1F4kC42D4rB4lJojE4lJo8E4lJgvFwuOwxKwjMoyJ45YowU40OwqLw_IgoG4wLghHwiFoxC43Kg2EwpEo4BokLgkDw-BwM4rBoGw-BwM4lJwlBwtHoG4zHnGwjM_xBo5Iv-B4hGn4BoyJ32D4lJvpEgoG32DouGvpEorKngIw4JvmI47NnvNgwMvqLgrC_qC4sInnH46G3oFwmI3oFgzIvpEw_IvwD4lJnxC4lJ_xB4lJ3SoyJ4S4lJgrC4lJgkD4lJojEgzIg2EgzIw7F4oFwpEgkD49CwtHonHg6H4sI4zH4lJ4yZg6gB44RguXojdo2lBgiOwrSw5QwvVghH4sIwtHgzIg2Eo8EwmI4zHg2E42DwmIw7Fo5IwiF4zHwwDojEo4BwmIoxCg9Dof4lJ4rBw3CoG4vEoGoqDAg-KvlBogIn4Bg6H_qConH_jDw4J3oFwpEv3CozQ_2LgvF32D4oFvwDg-K3hGwmI32D4sInqDwpE3rBo2M_jDogI3rBorKnfokLnfo6P_xBglKvlB4_QvlB4lJ_Yg5Z_qCwmInfw3CvMgkD3S4hG3rBgkDnf49Cnfo8E3kCw7FnqD4oFvwD4oFvpE4vEvpEo8E_uFw3CvwDg2EnuGoxC_8DwiF3sIwqLv9To7W_zoBoqD_nGwiF_rJoqD_8Dw3C_jDo8Ev0Go1FvxKwlBv3Cw-BvtHo4B_8DouGnkLgvFv4Jw3CvpEoxCnqDg9DnqD42Dv-BwiFnqDo5I3zH4hGn8EwpE39CojE39CoqDv3Co1Fn1FgkD3kCwiFv3CgvF39CwpEv3CgkD_xBgkc_6O4zH_8DgZ3So8EnxCwwD3rB42DnfwwDvMg9DAwiFgZojEofg6HwpEwgQ43KojEw3CwiFoqDwqLwmIw3C4kCwpEgrCojEwlBwpE4rBwpEofwtHwlB42D4SwrSoxCwjMo4BwrSw3Co1FgZw0Gofw0GofwzYwwDwoWw3Cg9cwwDwqLofwpEAghHAgsJ_Y40O3kCwiFvlBg9Dnfw0Gv3Co1Fv-BwmI_jDgoG3kCogI_jDw4J32DwpEn4Bg9D_xBwpE_xB4vEn4BwgQnuG4iNv7Fo3T_kKw7F32Dw7F_1EgvF3oFwxK3wLo5InkL4sIv8MogI_hO4vEv_I4vE_kKgvFvuO4vEn2Mo9LvgpBw0G_tXwmhBns1Dg9D_rJ49Cn5IokL_riBw7FvkTgvFvrSwpE3pMoqDn5Ig9D_5Ho8EngIwwD_1EwpE3vEoqD39CoqDnxC49Cn4BwwDn4B46G_qCojE_YwwDnGg2EwMg7O4kCgzhB42DgvFoGgzI_YghH4SgtQgZgpNoG4imBwMoxb_xB4kb_qCo4avwD421B3zH4gY_8Dg2dvpEw-a39Cg_RvlBg_R3Sg_RAg_R4rBg_Ro4BokLo4BonHofggZwiFgjVo1FooOwpEooOo8EooOgvFwyqBg_RoxbwqL4iNo8EgiOwiF4uWonH4jU4hGwiFgyBg9DwlB42c46G47N49CwvVojEokL4kCoqcwpEguXwwDo5Iofo4agkDorKwlB49CwM4zHofwhXgrC4shBoxCw-ao4Bw3b4rBwwcof4z5B4SgkcvM4uW3Sg6HvMo4BAoq1Bv3C41V_Y4wLnGg-KoGg-KA4qT4SoiWgyB4kCwMgsJofg1WgkDwyRgrCwgQoxCowUwpE4qsB4lJw9ToqD4wLgyBo6PgyBwgQwlBg-KoGwiFoGwgQvMg8V3rBorKvlBo-Sv3Co2M_qCwgQvwDwgQ_8D4mQn8E4mQ3oFouf33K4tPn8E4tP_1EwrS3vE4iN_jDo6P_jDg0PnxCwgQ3kCwgQ3rBwgQvlBo6P3SozpB3rB4_Qnfg1Wv-Bw5Q3kC4jUnqDwkTnqDoiWn8E4vEvlBg6H3kC4wkBvxKgwMnjEg4S_gHo2MviFowUn5IoonBvyRw7FnqDwtHvpEg0Pv_Ig7O_yIwrS3wLolS_2LolS_vMwqkB3raw4iB_4ZghgBntYopVn6PosR_oNozpBn1e4i_BnivB42DnxCgnY3_QgiO_yIo2MnnHwqL_uF4wLn8EwqLnjE4wLnqDwqLv3CwmI_xBogIvlBo9LvlBg6HvMg-KAwjM4SwrSgyBwrS4kCw8MgyBorK4rBgzhBgkD40OnGwpEnGg9DA4sI3SonH_YwxK_xBorK3kCo6PvpE4_Q_nGgiO_nGohPngIorK3hG4mQ33KojEv3C46G3vEgvF32Dg2E_jDg3kB35YgiOv_Iwla3mQoyJ_uF4tP_yIwlav1Ng-jB_sQ4yZ3-J43jBn2MwqkBnrKw1N_jDguXn8EomZvpEwzYnqD4gYn4Bo9L3SwjMnGgjV4Sg7OofwqL4rBokLo4B4pMoxCwxK4kCo9LoqD4wL42DwqLojEwqLg2EokLwiF4iNgoGgkDo4BonHg9Do5I4oFwiF49C4wLonHgpNw_IoyiBg5Z4wLgzI4kb41Vo6P4pM4oFojEg9D49Cok9Bw6wB4zHw7FojdwhXotxBwunBo1Fg2Eo1F4vEw_IonHwlagqUg4S40O44Rw8MovNgsJw1N4lJ47NgzIooOwmIooO4zHooO46GwuOgoGwuOwiFwtHgrCghHw-BwxKgrCgwM4kCwnPgyB4wLgZouGoGglK3SwqLnf4mQnxC4pM39C4iN_8Dw_I_jDgiOn1FouGv3C49C_xB4shBvnPg_qB_3So5I32DooOn1Fw5Q_nGgzhB_2L4tPn8EojdvmI4vdnnHg7O39CohP_qCg7On4BohPvlBg7OnGg7OwM40OwlBooOgyBgiOoxCooOgkD40OojEwnPo8EwnPo1FohPouGg9cgiOw8Mw0Gojdg7OotYwjMgnYg3Lg9cw8M43K4vEwqkBgiOo3TonH40Oo8EopVgoG4vEwlBwtHw-Bo9LoqDgwlBo5IopVojEoiW42Dw0f4vE4mQo4Bg6gBoxCozQgZwgQwMo0XAgsiB3rBw6X_xBwjMvlBw6Xv3Cw0Gnfo8EvMwnP_qCohPv3Cw7e_nGo6P32Dgya_gHwjlBvxKwvuB37NopVv7F4-Jv3CguXn8EwjM3kCoiW39Coxb_xBgwMnGgwMoG4pM4SwjMofgwM4rB4pMo4B4mQw3C4uWwiF47mB4lJgljB4zHw0GwlBg6H4rBo8EgZgyaw3Co2Mofg5Zofg_RvMokLvM4vEnGo9L3rBgwMn4BgwM3kCo2M39CgmRn8EwmInxCojE_xBwmI_jD4zH39CgpN_uF4mpB3xSgwMn8E4iN3vEwvV_nG44Rv3Cw8Mn4Bo2Mnfw8MnGw8MwM4iNwlB4iNgyB4iNoxC4iN49Cw8Mg9Dw8M4vEgwMo8Eo2Mw7Fw1mBo-Sw8Mw7F4iNgvFoiWonHovNwwDgpNw3CgpNw-B4iNofw8M4SwnPvMglK_YgwM_xB4pM3kCwjMv3CorKv3C4s6BvkTokL39Cg-KnxCokLv-BwqL_xBonHvMg6H_Y4wLnGg3LoGo9LgZgoGgZgvF4Sg3L4kC47NoqDwqLoqDo8EgyB4-JgrCwjMg2Eg3LwiF4wLgvF4wL4hGonHojEwpEoxCwqLwtHg3LogI4vdg8VwiF42D4-JwtHoxCo4Bw3Cw-BwpE49Cg4SgwMg3LwtH4gY47NwjMgoGozQogIgwMgvFgjuBg4So2Mo1FgwMw0GgwM4zHg6HwiF4mQo9Lw1Ng3Lw_IogIg-Kg-KwxK4wLwxKw8M43Kw1NwxKohPglK4tPoyJo6P4lJgtQ4oeoy7Bw1NomZ40O4gYghHorK4wLgtQ4-J4iNo2MohPwwDojE4iNw1Nw8MgwMo2MokL4pM4-Jg4Sw1No6PwqL4z5BgmqBo4aowUo8E42DouGwiFoqDw3Cwpd4nXo3TwgQwqkBo1ew2tB4toBo8dw-aw4J4lJg7OgiOg_RozQo7vB4jtBwzYo7Ww6XwoWguXopVg_R4tPg2dgnYw6XolSg6gBo7WowU4iN4_QorKw5Qw4JotYw8Mg5Zo2M4_Q4zHgzhBovNgmR4hGosRo1FosR4oFwmI4kCgyaouG4-iB46G4ra42DgqUo4Bw8Mof4vEwMokkBo4Bg7nB4S4yZgZw30BofosR4S4iN4SwtHwMggyB49C41uBgvFw7eo8EgiOw3Cg3LgrCw4JgrCw5QwwDg-Kw3CggZgoGw6XonHwieglKgjVg6Hwlag-Ko_Z4pMg5ZovNomZooOggZ4tPwvV47Nwwc4xS45Y4tPomZooO4yZ4iNwsZ4wLwsZorKw0GoxCouG4kCgtQgvFggZwtHwlaw0G4ragvFo4awpEw-zBw7Foxb49CgyagkDwlawwDgyawpE4rag2EwgpBgzIoyJ4kCo4zBgpNo_Z4zHgiO4vEwpd4lJgvFw-B4mpB47Nw4JwwDg5ZgsJ47mBovNo_ZwmI4-JoxCo6PwpEwiFwlB4hG4rB4uWwiF4xSoqD45Y42Dw6X49CotYw-BotYwlBwsZwMongB_YwmIvM4_Q_xBozQvlBgpmB_uFo_Zn8E4rav7F4gYv7Fg4Sn8E49b36GgwlBvmIg0PnxCwnP3kCwuOn4Bg8V_xBg6HnG4_QoGosRgyBosRw3Cw5Q42DozQo8E4mQw7Fo6P46GwnPg6HwuOwmIwx8BgwlBo6Po5I4mQg6HwgQ46GwgQ4hG4mQwiFw1N42D43KgrCo2MgrCw04BwtH4qTw3CwgQoqD4mQ42DgtQ4vEgtQ4oF4mQ4hGo0Xw4JguXg-KgjVorK4kb4iNooO4hGg-KwpEovNo8E4pM42DohPg9DorK4kCgpNgrCo9LgyB40O4rBg1W4SoqDnG4hGAwuO3So8E3SwtH3S4mQv-Bg9cn8EwiFvlBomZv0GwqLvwDgwMvpE4gY3lJgnY33Ko1Fv3C4hGv3Cg3Ln1Fw6XvjM441Dvj-Bg7yD338Bg2EnxCgrb30OwhX_oNguXnoOo7W_zPg0P3wLo6P3pMo6P_oNg3LvxKg0P30OwmIvmIgzI_rJorK33Ko1F_nGojE3vEosR_wTooOnsRo2M3mQ4mQ38UgvFvtH41V3zgBo2M3jUg3L_wT4vE36GojE_gHw5Qnjd4pMvvV46G_2L4oF3sIgsJ3iNo8Ev0G49CvpE4sIvqLgiOvyRg7On6PwrSnsRw_I_5Hg6H_nGgsJ36Go9L_5H4hG_8D4wLnuGo8E_qC49C3rBosRngIw4JvwDw7F3kCwuO_8DwrS_8Dwt5B3wLwlzBv_IgyzBnnHw5pB3oFwpd39C4-7B_uF4pMvM4wLoGw_IgZwxKgyBolSojEgwMojEouGoxC4vEw-BooOgoGwjMw0GgiO4lJooO43K4-JgzI4pMwqLolrB4rzBoyJ4wLghH4sI4sI4-JorK4iNg9Dg2EgvFgoGoqDg9DwkTwvVwjMg7OghH4sIw5pB4yyBwhX4kb4vdwqkBw6XwwcorK4pMw9TgnYw7FonHg9Do8E49CwwDoyJg3LooOwyRw4Jo2MwjMw5Q41V4zgBg-KwkTwqLw2UoyJo-SgoGgpNgpNgofogIw2Uw0Gg4So1F4_QgiO4nwBwwD47NojEolSw-Bo5I4rB4hGwwD4tPoqDolSgvFg6gB42D49bwiFwksBwuOwurEwlBwqLgZgzIg-KwtrDokLg6rDwMg2EwlBg-K4kCw2U42Douf4rBwqLgkDoiWgvF4oegkDw5Qo1FwsZonH4vd46GgnYgoGo3TgvF4mQgkDgsJ4-Jg5ZwnPw4iBgvFwjMw_IolSwiFoyJwyR4hfwhpC4zkE4wLwvVwqLguXgwMwpdo5Ig1WokL4oeonHwhXw4JwxjBgrCorKwiFoiW49CgiOw-B4-JgsJwgiC42Dg3kBgyBw9TwlBw9TwlBwsZwM4jU3So6oB_YwrSvlBwrSvlB4qT_1Eo99Bv3CowtB3rB4wkBnGgof4S4oe4rBg2dw3CotxBonHwr2DgvFgylDof49bwMwpd3Sojd_YgxTv-Bojdv3CwpdnqDojdnjEoqcviFoxb_gHgzhB_6Oo6hC_tXo1pD_1EguX_8DwhXv3Co-S_jDgyav-BgjVvlBopV_YopVAgjVwMwnPofw3b42DoioCwMohPA4pMnfo4a_xB4kbnxCwwc3kC4xS_1Ew7e36f4jjG3uW4ppE_jDw2U_xBwjM3kCg0Pnfg6H_qComZ_Y4zH3kCg6gB_YomZ3SwtgB4So4a4rBoghB4kCo6oBoxCg7nB4Sg6HgZwuOgZwyRghHw8wD42Dw5iCgyBgsiBofw_hBwMomyB3SosqB3SwhX_Y4oe_xBovmB3So5Infw5Q3rBgmR3hG47_Bv3bwyrI3hGo13B_jDw7enqDongB3rBw1N3oFo7vB3-JwvgDnjEo5hB32D4kbn1Fw7e_1EguXv3CgwM39Co2MnxCoyJvtH4ra32Do9L3hGgxT_1EgpNv_IwzY_vMgvenlSg3kBnyJosR3iNoiWn5Iw1NnjE4oF3sI4wLv0Gw_I_5HglK_rJ43Knxbojd_lRo-Sv4Jo9L3oFwtHn8EghHvwDo8EnsRg9c3wL4uWnqDwtHviFokLvjMw0fnjEo9Lv3C4sI3zH4kbnqDw1N3vEo-S3oFg5ZvxKoq1B36fog-E3nXwnzD3sI4_pBnlSg06CviF4yZnjEgqUnqDwgQ_gHgsiB_uFguXnyJg3kB36Gg1Wv0G48UnyJoxb3hGo6P_rJoiW_nGovN3sI4_QngIohPvgQ49bn6P45Yv4JooO_5HwxK3ra46f34RwkT3mpB4jtBvkT4jU3tPg_RnkL47N3oFonHn5Io9L_kKg7OnyJ4tPv7F4-Jv0GwqL3hGokL_uFg-K_gHg7O_nGgiOvtHwyRv4JwsZ_hOgmqBvtHg5Z3vE4_QnjE4mQ3zHo5hB_5HwunB3jtBwliH3pM438Bv3CovN_4ZgkgEv8M40gC37NgqmC_yIwyqBn1egr4E37N47_B_2Lg5yB37N4z5Bv8M4yyBv9T4npC3zgBg_1D3vE4_Qv-BonH_vMw9sBnxCo5InyJw4iBv7FopV3lJ4shBngIojd3iNwvuBv4JoghBn1Fg_RvjMw4iB_rJgnYnjEw4Jv_IgxTviFokLviForK_1Eo5IvwD46G_jDgvFnhPomZv7FgsJngIo9LnyJovN_yIo9L3pMgtQ3l7Bo4sC3hGwmIv_IgpNn5Iw1N3zHgpN_yIgtQn5Ig_RnnHwgQnyJgnY_1Eo2MvpEgpN3sIg9c_qCgzI32Dg0PnrK4gxB_jDohP3oFo_Z_6OgxlCvtH4zgB3wL4uvB_gH4ra_2LgmqB34jC4vlHvuOwhwBn9Lg0oB3iNwksB3vEwgQ_1Eg0PvxKoyiBv7FwrSnrK4zgB_hOgtpB_9K4vd33Kgrb_jDwtHnqD4zHvmIg4S_oNojd_1E4-JnrKgqU33KgqUnhPo4a3sI40OvvVw4iBv4JwnPv7ewvuBv2tB44jC3jtBgxlCnuG4-Jv_I40O3sIgpNn3ToghB__Yo-rB_mYo3sB_hO4kb35Yg5yBvqLw6XnyJgjVvtHgtQ_hOwtgBnvNongB_rJguX_3SwhwBvxKoqc_2LongBnyJoxbvuO44qBvsZw3tC3pMw8lB3kCghHvtHwoWv0G48UvuOgxsBvuOgxsBvksBg3oEn3Tor8B_kKongBn5Iw-avvVg0hC_-R4h4B_sQ45xB34Ro13Bv0G41Vn1FgxT3zHw3b_8DwnP_uFwoWv3CokLv3C4pMvmIginBviFg2d_gH41uB32D4kbn4BgtQ39CwwcnxCongBn4Bwwcn4Bo0wBvMwrSA43KAouGwMg2d4Sgofw3Cg6yC4hGwn-FgyB4k0B4rBo6hCgZwiwCvMgs7Bnfo_yB3S41V39CwvnCnqDor8BvpEor8BnjEguwB3oFww1B_qCgqU_8DgljBnnHwm6B3zHw04Bv1No66C3-J438BviFg9c3zHwgpBvmIo6oB_kK4nwBvxK4nwBvtHw0f_9Kg4rBvmIgofnjE40O33KwunB3iNowtBvxKg7nBvnP438BvrSwiwCvnPgupCnxCw1Nv-Bg-KviFw3bnlSg6rDvtHw5pBv_Ig8uBn5I44qB3hGgrb_jDw1NngIokkB39Cw8M3vEw5Qv8M4rzBv5Qwj-B_xa4x9C32Do2M_uFgmR_1Eg0P32DwjM3-JoyiBniW4rsC38UgnqC_uF4qT_6O464B_jDw8MvpEw9T_rJwnoB_gH4-iB_jDosR3vEwzY32Do_ZviFw5pB39C4vd_kK4n7D_jD4vdnjEwie_1Eg2dviFoqcv7Fwwc3xSw_zC_1E4gYv-B4-Jn1FwxjBvwD4kb3S42D_YogI_8DwsyB_xB48tBAo3sBgyB4l0CgZo9kBA40OoGopV3SwunBvlBgofn4Bw_hB3kC4shBv3CgzhBv3Co4a_8DongB3vEw0fvwDg8V_xBglKn1F4zgBv8M4p-BviFowUv_Io5hBngIoqcv7F4xS3oF4tP_9Kojdv4J45Y3oFwjMvgQ43jB_kKopV_7V4xrBvpdwt5B36fohhCnsRg3kBn0X421B_yIgjVngIowU3hGozQ36GwrSvnPo-rBnyJo1e_zP4v2Bv0GomZviFowUv0G4vd_5Hg-jBn1Foqc32Dw2U_8D4uW_yI4h4BnyJopnC_jD4kb_jDgnYn8EgpmB3rBwxKnnHgh5BnjE42cnjE4gY3oF42cv7Fw3b3vEwkT_gHw-annH4yZ_jD4-Jv-BouGviFozQvxKwie3zH4jUnzQ4_pB_3So7vB_yI4gY33Kw_hB_8Do2M3sIwie_nGgyan8E4qTnfg9Dn8Ew6X3hGoghB3zH45xBnrK46xC3kCowUv7Fo56BviFwzqC3S4zHvMo5InxCwvuBvMgwMnGoqD_qC49tCvlBgyzBvlBwy8C_Y46fnG4xSv-BwhiDnfwlavlBwhXv3Cg3kB3kC4uW3rBw8MnxC4jUv-BgpN_qCg7O3vEoqc_jD44RvwDwyRnqDw5Q3vE4jUnoOowmCv7F46fn4BorKv3CosR_1E43jBn8EgjuB3kCgof3rBgve_Yw7enGo9kBwMw8MAgrCwMozQ4SwrSgyB47mBgyB4uW42Do-rBgkDojdwwDw3bw7FwnoBojEwzYo8EwlagvFoqc46GwpdwxKg_qBooOo4zBw2U4qlCw-Bw0G4sI49b44qBolvE41VwvnCwgQg91Bg8uB4h8EotYw7wCohPwlzBgyBwiFg6H4kbo6Pg65BonHw3bgoG4rao5IwjlBw_IosqBo1Fw7eoqDg4S4rB4zHgyB4lJgkDoiW4oFwksB4kCg1Ww3CoufwlBwkTwMglKgZwpdoGw5QnGoonBnfw-a3So9Lv-Bo8d_qCwla_qCg1W_jDwsZn4Bo9Lnf46G3zHgmqB3hG4vd_gHwpdnuG4yZviF4xS_gHg1Wn5I4kbvjMgljBvmIo7W3-0CwwkH3rB42DvtHgxT_qCw7F32Dw4J_qCouG3-iBwvgD3oFwgQv_Io8dvnPw30B3-Jw1mB39Co9L_2Lox0BnuGg6gBv7Fw0f36Go6oB3sIgigCnxCg4SnqD4shBv3C46fnf4wLvlBohP3Sw4JvMw0GviFgylD39CwsyB_qCgzhB_jDo5hB32Dw0f_xB4pMnjEwie_1E4kb_rJ4rzBnrjB4vzF_rJggyBvwDopVnqDgqU3zHggyB3vE4shBn1FopuBnuGgupCnqDg8uB_qCguwBv-BgxlCvMox0Bofok9BgyB4rzB42Do4-DgZggyBvMomyB_YokkB_xBw9sB_jDog6B32DwovB32D4toB_xBovNnxCg1WvpEw4iB_8Do4anqD48U3oFo8d3sIgmqBv5QwhpC_gH42cnlSotqCnhP47_Bn9Lo_yBnkL4yyB_qCwxKv5QouxC_2Lgl8BnjEwoW33K438B3lJoj2BnrKohhC_rJov_B3sIw47Bv_IwooCv3CguXnjE4plBv3CwsZn4BosR3hGo0pC3kCwxjB3rBg6gBv-Bo4sCAg3kBwMwlzBoGgzIwMg3LwMw8Mw-BwvuBouGoxmDo5IoorEghHgluDw_Iw4mEw7Fo23CgyBw-agZo9Lofg_R4SozQoGozQnG43K3So3T3rBgxT3kCwrS_jDwvVnjEo7WnqDg7OvpEw5Q39CglKvtHoiW_5Hw2Un5IwkTnuG4pM3-J4_Q_yIgpNv-BoxCvgQw9TvjMgwM3sI4zH3hGg2E36Go8E36G4vE_nG42Dv_IojEngI49CnyJgkDn5IoxC3mQoqDvgQw3C_qbo8EvwD4Sv2mCovN3imBonHvmIw-Bn6PwiF3wL4vEn9Lw7F_jDgyB3hGg9D3zHwiFv4JonHvyRooO3zH4zHvuO4tP_nGwtH_nGogIv0Gw_IvtH43KngIo2Mv4JozQnrKw9T_nG4iN3hG47NngIgxT39C4sIvpEo2Mn8Eg7O3vEwnP_rJg6gB3zHo4an8Eg7O_1Eo2M_jDwmInnH4mQ_xB42D_rJo3T3tPghgBv1N49bnzQw_hB_jDgoGv-BwpE3lJ48UvwDwmIvtHgqU_nGowUv7Fg1WnxCokLv-B43K_qCgwMv-BgpN_qCo3Tn4Bg1W_Y4pMnGokLnG4qTwMgmRgZo6P4rBwyRw-Bw5QgZgoGw-BovNw-B4iNo4BglKgoGovmBojEg5ZgyBglKoqD4jUg5ZwvyEg-Kog6Bg-Kou4BghH4-iBwzYo33DosRwpvCg9D44RguXo_kDg7O4p-BwuOo56BoiWok2C4-J4plBosRg7gCotYo23Cw0Gg1WorK43jBwnPo4zBg1WotqCw8Mo6oB4iNw5pBongBg1hD40Og4rB4jUog6Bg_RwlzBorK4vd44R4nwBgvFwuOwjMg6gBoghBg-1Co9L4oew4J4gYofw3CgwMw7e46GgmRw-Bo8E4pMoufo8Eo2M4jUoq1BooOohoBorKgve49Cw_Iw3CogIw8MosqB40OomyBwiFo-SgrC4sIoxCoyJgkD4pM49Cg3Lw0Ggrbo4BogIgoGo4awxK45xBwpE41VgrCg3L4lJo_yB46Gg7nB42DgnY46GgjuBojE4kbo1FozpB49CowUo4Bo2MwwDgrbw7Fo-rBw-Bo6Po4Bw1No4BgiO4pMow_Cg3Lo66C46G490BogIov_BglK4vvCgsJgqmCo5I4qlCouGomyBogIw8-BwgQot8Dg3Lgm8Cw0GgyzBojEongBg2EwxjBonHw04B4iNo4lDwtHgz6BgpN42nDovN4opDwxKogzCg6Ho99Bw_Iw9lCghH421BgwM4niDwxKo5zCgoG4yyB4zHolkCw3Cw3bgrCg2d4rBo7WwMg2Ew-BoufwlBguXwMwnPoG4zH4S4mQgZwjlBoGw0GnGorK3SozQ_YokLvlB4wL3rBwqLnfwxKnfooOvMgiOoGgzhBvMo2Mv-Bw3b39C4yZ3kCwkTv7F4rzBv3CoqcvMgoGv-Bo8d_Y48UnGg6H3Sw-aAg5Z4rB45xBwlBgxTgyBolSoxCw-awwD46foxCo-SgoGgpmB4hG4oewwDwnPwtHo8d4sIg2d49Co5IgvFo6Pg-K4vd49Cg6Hg6H4xSw1No8do8EokLonHo6PouG40OojEgzIwqkBgvwCohoBov4Co5I48UwpEg-KgsJgrb4vEgiOwwDwjMwpE4mQoqDw1NgkDgiOw3CwuOoxCgiO49C4xSgrC44RgsJos8CwkTg_gGwwDg4rBgyBw5pBwMgs0CwM4xiNoGw3tCAgoqDwMwjMoGo9LofopV4rBowU4vEgh5BogI4uhDoqDg0oB4Sw0GwlB47NgkD4imBw4J484D4nX4s7I4iN4-_Eofo9LoqDgyzBgZ4xSgrCgx-C4rBo5hBgZokLofg-Kw-B45Y4kCo3ToqDwlag9D4yZwwDopVonHg3kBwpE4qT4hGotYouGgnY4hGw2UgvFwyRo5IwsZglKgyagzIowUgtQ4wkBw_I4xSo2lBg2vCogIg_RgpN4hf41Vg91BozQowtBg0PgqtB4sIwlawuOwhwBokLwnoBgoG4uW4sI4vdozQgs7B4oF4xSgqU41nCo5I4zgB4plB4lmE4vEw5QgzI4hfw4J4imBg6Hw_hBokLo4zBgsJ4nwBwiF42cwiFgof42DwhXgsJou4BwM4kCoyJw_6B4vE4yZ4rBw0Gw0GoqcoqDo2MwwDwjMg9Do9LojEokLwpEwxKgzIw9TorKw9To8E4sIg6HgwMwtHorKwmI43Ko2MohP48UwhXw_IwxKo5Ig-K4tPowU43KgtQwgQwwcg2EoyJgvF4wLglKo0XojE43Kw4J49bonHgnY4oFgxTouGggZw3Co9LoqDovNolrBgutFwxK44qBogIw7ewmIoxbwmI45YgvFwuO46GgtQw0Gg7Og7OojdogIw1NgiO41Vw4JgpN4lJ4wLo5I4-J4lJoyJg6HonHw_IogI4-JogIovNgsJgsJo1FwnPo5Ig_Rw4JwsZooO4oF49Cw3bwnP4_Qw4JgiOgzIogIgvFgzIw0G4zHgoGozQo6P4wLgwMwtHgsJ4oF46GgzIo9LoqDo8E4zH4pM4vE4zHglKg_RwxKowUgwMwsZo1F4pMovNo1eo8E4pMg2Eg-K4iN4liBgoGosRo9L43jB4hGwkTwxKwqkBo1F41V4oFw2UouGw-ag-Kw-zBwwDg_Ro5Io0wBo8Eg9cg2Eg9c4sIw73BghH490BgoGgr0B4sIo1wCg9D4xrBg2Egw-Bg9DgmjCoqDo4sCoxC464Bw3CotxB4kCw0f4kCwlaoqDokkBw3CwzYoqDgkcg2E4-iBwtHg1vB42Dg8Vo1Fo1e4zH4imB4zH4-iBouGgkc46G4kbghHo_ZgzIoufgzIoqcg7Og8uBgzI45YoyJwlawpEokLojEokLosRwrrBg3Lo4a4zHosRwmIwyR4sIosRg7Og2d40O4kbw8MwhX4-J4_QwgQo_ZgxsBg_jCgwM4qTwnPgnYwuOotYgwMwhX4iNo_ZgwMo4a4-Jo7WorKwsZohPg0oBghHw2Uw7FwrS4hGgxTwiF44Rw_IgzhBwpEgmRghHw0fw8Mwj-BgoGgzhB4zHwrrB42Dg8V4rBgsJof4hGofghH4rB4lJoyJolkCg3LoxmDgkD4plBw-BwzY4rBgjV4rBwmhBgZw0f3S4k0B_Yw2U_xBw3bv-Bo_Zn4Bg4Sv-Bg4S_qC4xSv0GgqtB3hG4shBvwDosRvmIwqkBviF4jU33KohoBvmIg2d3-Jg7nBn5IoonB3vE4uWv7FoghBnuGwunB3mQ4j4D3kCw1N_8DwzYvmI4jtB3vEg1W_5HwqkBv8Mwi3B_oN4v2Bn2Mgr0Bv7Fg5Z3vE41VvwDgtQ_uFoxbv0G4-iB_uFw7eviFw7en5Iwm6BviF40nB3zHwugC32D4imB39Cw4iB_1EoziC39C4s6Bn4B4_pB_qC4szC_Y4gxBnGo8oDgyBwk-C4kC4thCwwDwpvCgrCwyqB42D4z5Bw0Ggl1C4oFw73Bw3CwieoqDw7ewtHwj-B4vEoyiBwiF4-iBg2E4oe4oFgof4oFojdggZ49_DwiFoxbwwDowUg9D4nXg9DwlagvFg7nB4oFwhwBw-B4jUwwDwrrBogIo4-Dw-B4rag9D4mpB4vEg-jBonHo7vBwvVwz8DwmIgyzBg6Hwi3Bg9D4zgBgkDg9cw3Cwpd4kCoxbw-Bg9cgyB42cofwzYof4qsBoGo1enGw0f3rBo_yB39Cg22B_qC4shB3kCwzY_jDo1e3iN4j4D3SgvFvlBwqL_Y4sIvwDwmhBnjEg_qBviFwm6Bv3Cw4iBvMojEnGoxC3oF49tCv3CgjuBv-BovmB3SgwM_Y44RnxCgmjC_Yo4a3Sw5Qv-Boz7CnG4miCwMongBo4Bgs7B4So2Mo4B42cw-B4nXofw_Io4BwrSw0Gog6BoqDgkcojEwyqBwlBwnP4rBo4awlBgjuBA4-JnG40On4Bg0oB3rBozQnjEo-rBv3CowU3vEoqcvwDo3T3sI4_pBnjEowU_rJo7vBnxCohPnqD48U_qCwgQ3oFw9sBv3Cw_hB_qCgjuB3SgqUnGglKA4jUofotxB4rBo_ZgyBwvV4kC4gYwiFgxsBoxCg4So8E4vdojE4nXwiFw6Xw7F4ragiO438BogI4wkBgvFg9cojEo0Xg9Dg5Z42DoxbgkDo_Z49Co8dw-B4yZgyBgrbwlBo4awMgxT4Sw-anGwzY3SgnYn4Bg4rB_jDw5pB3kC4uWv1Nop5DnxCo1e3rBw2U3SgiO_Yg1WnGg9c4SgofgZosRgyB4nXw-Bg1WoqDw7eouG4v2Bo4BohPo4Bg7O4oFg1vBgkDgvewpEo_yBg9Dwp2B4S4iNoxC464BgZggZwMoghBoGooO3S4jmCvlBwxjB_xBg8uBv3Cgo4B_nG46jE3kCw73B_xBg39B_YwnoBAohPnG4nX4Sw3tCoGwkTwM4nXoxCw6pC49Cwx8Bg9Dg-8B49C47mBw-B4gY4SgoGwlBw1NogIojvCoqDo8dw4JgrtCokLgrtCgzIox0Bw3bwxgFgzIo_yBghHwrrBgoGo6oBw0G41uBorKw0xC42Dg2dwiFgqtBojEovmBoqDongBw0Gwj-BorK4t6CgvFosqBo8EorjBwiF4liBogIwlzBghHozpBwjMgtiC46G4liBwxKotxBw-BgzI4sIwxjBw0GwlawxKohoBw_Iouf4sIoxbgtQgyzBo2Mw1mBwjMw_hBwqLw0fwwD4-JosqBwk3DghH48Uo9LgwlB49C4-JgZgrCg3Lo3sBgoGo4awpEwkTghHo5hBouGwxjBwlBonHw3ColSg9DwsZgvF4qsBoxC4gYgkDo2lBwlBo6Po4Bo1egyBomyBoGo1enG47mB3kCov8F_xBw3_DvMwovB3Sw0fnfoz7C4SgwlBwlBw8lBw3CgljBwwDo1eo4Bw1NoxC4mQgvFghgBoqDozQ42Dw5Q4vE4xSgoGo0Xg2EozQwiF4mQ43Koufo1FwnPwiFo2Mo8EwqLorKwoW4vEoyJw4Jo-S4vE4sIwtHo2M4sIw1No8EwtHw-BoqDwgQg1W4sIwxKwmIglKo5IglKgsJ4-JwqLwqLglKgsJgmRgiOg0Pg-Kw8Mg6HovNwtHorKwiFguwBwoWwnoBwrSgofooO4hfooOg7OghHw3C4rBgnY43KgtiCo1eosqBwzY4zHgvFonHo1Fg6HouG4sI4zHo2MwjMonHwtH46GwtHovNo6P4iN4_Qo2MolS4pMgxTouGg3Lo5IohP4-JwrSg9D46G49CwiFonH4pMg6H4pM4tP4uW43KgiOw4Jo9LgzIw4Jw_IoyJw_I4lJw_I4sIwjMwxKgoGg2EgwMw_Iw1Nw_Ig6Hg2EohPg6Hw9TgzIg3LojEwnPojEg6Ho4BonHwlBo0XoxCwgQw-B4zHwlB4sI4rBogIo4BogIgrCogIoxCogI49CogIgkDogIwwDo6PwmI4tP4lJ4zHwiFg8Vw5QghH4hGgiOovNwuOohP46Gg6HgpN4mQw8MgmRolSw3bwuO45Yo1FwxKo1FokLghHg7OwwDwtHw4Jg1WovNw4iBgkD4sIwlBgkD4hGwgQgzIwvVgoGooOouGgiO46GgiOonH47N4wLopVg3Lg4Sg-KgtQo9L4mQo9LohP47NwgQ4hGouGw_Io5IwpEwpEwmIonHwtHouG4zH4hGwmIgoG4zH4oFw5QwxK46Gg9D4oeg0PwjMw0Gw0G42DwwDw-BozQw4J43K46G4qTo2MovNoyJw7F4vEg5Zw9Tg-Kw_I4qTozQw4Jo5Io2Mo9Lo1FgvFw4Jw4JwtHwtHw4J4-Jo9Lw8MwkTwvVwiFw7Fw8M4tPwoWgkcokLwuOw8M44RwqL4mQgwM4xSo2M4qTgzIw1NosR42c4lJ4mQ46Go9LwlaoivBwvVo2lB4iNopVwuOo7W43K4mQw1Nw9To2Mg_R42DwiFg4SggZg7O4xSo6PwkTg6gBg7nBgiOwrSwpEgvFwxKooOojEo1FgjVwieojEouGw6Xw1mB47NwhXo9Lw2Ug0P49bo1FwxK4mQoufgjVg4rBw8MoqcoyJoiWwuOoyiBokLg9co5I4nX49CogI4-Jw3b4pM4wkB4iNgtpBwyRog6BgpNo6oBw_I4raw5QopuBo2MghgB4kC4oFgiO4liBgmRginBgsJo3Tg5Zw-zBo6PwtgBoxCo8Eo3TohoBgyBgkDopVwyqBw8Mo_Zo6Pw0f4vEg6Hg9DogIgrC4vEw3Cw7F40nB4vvCwvVo-rBw9T4xrB43K45Yg2EwqL40Og-jBooOgwlBo6Pw9sBg6HguXouGw9TwxKgsiBo1ew7pDoxCo5Io7WwwuCgvFg4So4BgoGwovBovjF4tPwp2Bw1N490Bw4J4mpBojE4xS43K4rzBg2E4gYwmIwvuBwiFwtgBouGo3sBo4Bo2MgrCg4S4kCg_RoxCo7WwpEwksBw3CgzhBgZ4sIgkDowtBo1Fw0qDoGwwD4lJ4guFofozQ4S43KgyBojdw7FgluDoxC4toBoG42D4vEg6yCoxCoivBgZ4qTo4Bg6gB4rBo1ewM4jUAoxbvMoyJn4Bo4a3rBgiOn4Bw1NnxCg0P_8D4jUnjEwyRnqDg3LnjE4iNnjEo9L_5Ho3T_yI4xS3vEo5I_8DghH_rJohP36GoyJ_uFonH32D4vE_kKwqL_hO47N_iVo-SnrKo5I33KogI37N4pM_1Eg9D32DgkD_pUgmR_lRo6P_yIgzIngIo5I_5HgsJ32DwiF_qC49C_uFogInyJohP_qCg2Ev_IosR_1EorKnjEw4JnxCouGnjE4wLnuGw9T32Dw1Nv3C4wLnxCo9L3vEotYnxCwkT3SghHv-B4nXnfg9cwMw2U4SohP4kCg2dgyB40OwqL4_7CwlBorKgyBw8Mw-BgxTw3C4imBwlBwpdoGg5Z_Yg4rBvlBo_Z_jDwvuBv-Bg2d_uF45qC_YoyJ_Y4wL3S4sI_sQw5xHv-BoxbvpEor8BvlB4_Q_qCg-jB39Cg_qB_qCgmqB_Yg4SvMo4aoGgxTAo1F4S4gYgrCoyiB4rBgwMgrCgmRw3Co6PwwDosRojEozQo8EgmRg9DwjMojEwqLojEwxKojEw4J4-Jw2UouG4wLwxKozQg6H43Kw0GogIgoGghHw_Iw_IooOo9LgjVwgQw1NglKgsiB4kb4-JwxKgpNovNgzI4lJgoG4zHouGw_I4hGorKwiFglKwjMgkc42DogIwpEg6Hg2E46GwiFw7FgvF4oF4-Jo5I4lJ4sI4qTosRw_Iw4Jw_IwqLw0GgsJo1FgzIo5IwuOo0XwyqBovNomZw3C4oFw7Fg3LonHo2MgsJgmRo6P42c4sIg0P42DonH40Ooxbg9DonHgrCgkDgsJ4mQ49CwpE49C42D42Dg9Do1FwpEw-BwlBgkD4rB42DwlBg9D4SwwDA42D3S42DvlBwwD_xB42D_qCg9DnqD42D_8DoqDnjEw-B_jDoxC3oFw3Cn5Iw-B3pMw3C_6O4rBnuGwlB3oFwlB_1E42Dv1NwiFn6PgkD3sIgZv-BgrC3hGgwM3vdwpE_rJ4oF_9KgrC3vEoqDv7Fg2E3zH46Gv4J49C32Do8En1FgwM3iNojEvpEoqDnqD46GnuGgrCn4B4hG32DwwDn4Bw-Bnf4oFnxCo1Fv3Cg_R3lJo1F_jDwnPngI47N3zHwwD_xBo8Ev-BgkD_xBo4B_YgvF3kCg9D_YgyBA49C4So4BgZ4kC4rB4zH46G4tP40OwpEojE4kCw-B4zHw0GgkDw3CgoGo1FojEojEwpEwpEg-Kg-KwpEo8EojEo1F42DghH4rBoqDgyBojEgrCwmI4kCo5Iw-Bw8MgyB4-J4SojEgvFw1mBwlBogI4sI4l7Bw7FgtpB4rBogIwlBo8E42Dg3L4vEw4JojE4hGghHghH4oFwwDwlBwM4kCofw-B4Sw7FgZgvFwMoyJwMw7F4So8EwlBojEgyBo1FwwDwwDw3CgZgZwwDn4BnGv3CwMn4BoxCn2M4zHonH4-Jw8M49C4S4vEnxCg6Hn1FgyB_YgZoGgZofo5IghgBgvFosRkpHggP",
          transport: {
            mode: "busRapid",
            name: "FlixBus N73",
            category: "Coach Service",
            color: "#73D700",
            textColor: "#FFFFFF",
            headsign: "Lund (Centralen)",
            shortName: "FlixBus N73",
            longName: "Ljubljana - Lund",
          },
          agency: {
            id: "65528_ba99721",
            name: "FlixBus",
            website: "https://global.flixbus.com",
          },
          attributions: [
            {
              id: "d2a3dda55cb717c0cc9a9d085a4e6870",
              href: "https://flixbus.com",
              text: "Information for public transit provided by FlixMobility GmbH",
              type: "disclaimer",
            },
          ],
        },
        {
          id: "R1-S5",
          type: "pedestrian",
          departure: {
            time: "2025-10-01T06:50:00+02:00",
            place: {
              name: "Copenhagen Busterminal",
              type: "station",
              location: {
                lat: 55.66449,
                lng: 12.56091,
              },
              id: "65528_6763",
              code: "KHG",
            },
          },
          arrival: {
            time: "2025-10-01T07:01:00+02:00",
            place: {
              name: "Havneholmen St. (Metro)",
              type: "station",
              location: {
                lat: 55.66091,
                lng: 12.559426,
              },
              id: "17355_22053",
            },
          },
          polyline:
            "BG-5vlqD470-XpX_vBvRz3BjcvmDvCjDvCT_EwC_YkSrOkIrJ7B7fnpBrYjXjI0oBnB0FU4IvC4NoL0yBjDoBjDkDvHoLrEsJzFwHnGwCzIiO",
          transport: {
            mode: "pedestrian",
          },
        },
        {
          id: "R1-S6",
          type: "transit",
          departure: {
            time: "2025-10-01T07:02:00+02:00",
            place: {
              name: "Havneholmen St. (Metro)",
              type: "station",
              location: {
                lat: 55.66091,
                lng: 12.559426,
              },
              id: "17355_22053",
            },
          },
          arrival: {
            time: "2025-10-01T07:05:00+02:00",
            place: {
              name: "Rådhuspladsen St. (Metro)",
              type: "station",
              location: {
                lat: 55.676373,
                lng: 12.568803,
              },
              id: "17355_78697",
            },
          },
          polyline:
            "BHwo30lhB4r1xvH87M_2Qw9JzzNk9HjkHg2J_-H43Fv_D42N71K05K3mL46LnkQ0kIj-Jw5GzuD45Jr-C4qJ4zC4uHkoFoqI8rK8iH0hMwsF8zLs-R4xmB46QwrmBsyI04X8tT8w3BooEsjNomF4yK4mGk4Hk3FwpE41G4_Bo0IgK46Vz6Cs4KwnFotO80SgyQg5Z",
          transport: {
            mode: "subway",
            name: "M4",
            category: "Subway, Metro",
            color: "#0299bb",
            headsign: "Orientkaj St. (Metro)",
            shortName: "M4",
          },
          agency: {
            id: "17355_156091e",
            name: "Metroselskabet",
            website: "https://m.dk",
          },
          attributions: [
            {
              id: "fd99ed0caca491face7b0a55acea971e",
              href: "http://www.rejseplanen.dk",
              text: "With the support of Rejseplanen",
              type: "disclaimer",
            },
          ],
        },
        {
          id: "R1-S7",
          type: "pedestrian",
          departure: {
            time: "2025-10-01T07:05:00+02:00",
            place: {
              name: "Rådhuspladsen St. (Metro)",
              type: "station",
              location: {
                lat: 55.676373,
                lng: 12.568803,
              },
              id: "17355_78697",
            },
          },
          arrival: {
            time: "2025-10-01T07:06:00+02:00",
            place: {
              type: "place",
              location: {
                lat: 55.676704,
                lng: 12.568478,
              },
            },
          },
          polyline: "BG2knmqDm4k_X-EtL4I3S",
          transport: {
            mode: "pedestrian",
          },
        },
      ],
    },
    {
      id: "R2",
      sections: [
        {
          id: "R2-S0",
          type: "pedestrian",
          departure: {
            time: "2025-09-30T19:13:00+02:00",
            place: {
              type: "place",
              location: {
                lat: 52.378909,
                lng: 4.900551,
              },
            },
          },
          arrival: {
            time: "2025-09-30T19:13:00+02:00",
            place: {
              name: "Amsterdam Centraal",
              type: "station",
              location: {
                lat: 52.37892,
                lng: 4.900889,
              },
              id: "21260_157177",
            },
          },
          polyline: "BG0v-8jDkyjrJqGwG",
          transport: {
            mode: "pedestrian",
          },
        },
        {
          id: "R2-S1",
          type: "transit",
          departure: {
            time: "2025-09-30T19:13:00+02:00",
            place: {
              name: "Amsterdam Centraal",
              type: "station",
              location: {
                lat: 52.37892,
                lng: 4.900889,
              },
              id: "21260_157177",
              platform: "5b",
            },
          },
          arrival: {
            time: "2025-09-30T19:18:00+02:00",
            place: {
              name: "Amsterdam Sloterdijk",
              type: "station",
              location: {
                lat: 52.388562,
                lng: 4.83716,
              },
              id: "21260_61838",
              platform: "4",
            },
          },
          polyline:
            "BHgruhnf8onv9Ck1pB_51D4ravzqC8rPv5kB4ooBz_oC0jLroX40nB3s2Ds7Qvz7Bg0FntsB4jFzxlCjhB37pM0zDzq6Cw5B_s0DAruZ",
          transport: {
            mode: "regionalTrain",
            name: "Sprinter",
            category: "Rail",
            headsign: "Uitgeest",
            shortName: "Sprinter",
            longName: "Uitgeest <-> Rotterdam Centraal SPR4000",
          },
          agency: {
            id: "21260_32b565d",
            name: "NS",
            website: "http://www.ns.nl",
          },
        },
        {
          id: "R2-S2",
          type: "pedestrian",
          departure: {
            time: "2025-09-30T19:18:00+02:00",
            place: {
              name: "Amsterdam Sloterdijk",
              type: "station",
              location: {
                lat: 52.388562,
                lng: 4.83716,
              },
              id: "21260_61838",
              platform: "4",
            },
          },
          arrival: {
            time: "2025-09-30T19:28:00+02:00",
            place: {
              name: "Amsterdam Sloterdijk",
              type: "station",
              location: {
                lat: 52.389758,
                lng: 4.838497,
              },
              id: "65528_2878",
              code: "AMD",
            },
          },
          polyline: "BHojunnfg5ro8CwrX0ja",
          notices: [
            {
              code: "simplePolyline",
            },
          ],
          spans: [
            {
              walkAttributes: ["indoor"],
            },
          ],
          transport: {
            mode: "pedestrian",
          },
        },
        {
          id: "R2-S3",
          type: "transit",
          departure: {
            time: "2025-09-30T19:30:00+02:00",
            place: {
              name: "Amsterdam Sloterdijk",
              type: "station",
              location: {
                lat: 52.389758,
                lng: 4.838497,
              },
              id: "65528_2878",
              code: "AMD",
            },
          },
          arrival: {
            time: "2025-10-01T02:40:00+02:00",
            place: {
              name: "Hamburg central bus station",
              type: "station",
              location: {
                lat: 53.551767,
                lng: 10.011657,
              },
              id: "65528_716",
              code: "HH",
            },
          },
          polyline:
            "BH41konf8wkp8CvR8aA43K_xB4rBnGwpEAw7FoGgqUAwwDAwwDwtHoGouGnGo8E3SoqDnGg9DnGonHvMwiFnGvMwgpBoGghHwMojEgZg2EA42DAoqDAw-BAg-KgkDgrCo4BofgrCwMo8EvM4zH3kC4-JvwDw3CvlBwpEnfw8M_Yg2E4S4iN4SgsJwwDo1Fw3Co9LgoGwxKonHonHgvF4zHouGo5I4sIo5IgsJwoWo4awkTwhXw7FghHw8M4tPg4S48Ug9Dg2EwpEo8EwgQwrSwiFw7Fg2EgvFgxTo7Wo1Fw0Go8EgoGgrCgrCgsJwqLwpE4oFg2Ew7F4zHoyJg9DwiF4-Jw8Mw-BgrCoqD4vEo9Lg7O4lJwxK4wL4pMg-K43Kw5QwgQo9Lo9LokkBoyiBo1eg2dogI4zH44R4_QgiOw1NgvFwiF4lJw_IojEojEghH46Gw7FgoG4vE4oFgvFghHgzI4pMgkD4oFw0Go6PoqDghH4oFw8MwmI4uWgkDgzIoxCouGg9DgsJoqDouG4vEogIo1F4lJwpEg6HwpEgzIo4BojEoqDgzIgkD4lJgvFw9ToqD47NwiF4nXgrCwjMoxCooOw-Bo2M4kCo6Pw-B4_QgZonHgyB4jU4rBorjBoG4oenG47NvMw1NvlB48Un4B4jUvlBokLvwD49bv-Bw8MnxCohPv3C47N32Dw5QnfwpEv-BwmI3SgrCvwDgpN3vEo6PvwD4wLviF4tPn1Fo6P_5HgxTn1FgpNn5I4qT_rJ4jUviFokL_uFo9L3hG4iNnvNo8dviFwqL_yIo3TnjEglKn4BojEv7Fg0P_1Eo2M33K4hf_uFo6Pn8E4iNn2MongBviFwjMv3CouG3rB49C_xBwwD3pM49b3mQorjB_vMgyanhPoufvjMgnYv7FwqL_9KopV3oF4-JnkL41VngI4tPv3CgvF_jDgoG_1EoyJv_IowU_yIg8VvpEg3Lv-BgoG_nGwkTn1Fo3T3hGguXn4Bg6Hv_IoyiBv7F4jU_uFwrS_1EwuOngIwzYn8EooO39Cg6H3kC4hG3kCo1F3hGwgQn4BwpE_8Dw4J36GozQvqLwsZngIwyR3zHwnP_oNwsZvtHovNn9Lw2U_kKgtQv4JwnPv_IovN_1E46G3zH43KvmIg-K_yIg-K3sIglKvqL4iN_gHg6HngI4sInvNovN_5HonHn1FwiF_jDw3Cv7F4oF3wLw4J_8DgkDv8Mg-K3qTozQ3-J4sI3_Q40OnyJwmInxC4kC3rBwlBv-BgyBn_Z41VviF4vEn4B4rBnnH4hG3wLw4Jv_IghHv-BgyBv4Jg6H32D49C_6OokL_vM4sIngIwiF_yIwiF_8DgrC3wL4hG3lJg2EngI42D3vE4kCnqDgyB3hGw3Cv4J42D_sQo1F_iVw7Fn2MgkDn1FwlBvqLo4BnoOo4BnqDwM3hGwM3iN4SvgQA_vM3S_hO3rBnnHnf_sQv3CnjE_YvnP32D3sInxC_nGn4Bn1Fv-Bn5I_jD_1En4B33KnjE3oF_qC_uF_qCv5QvmIv8Mv0G_hOvtH3lJviF__Y_oN_iV3wLvwDv-BvgQn5Iv-BvlB3wL_nG3hGvwD_kKn1Fn-rB__Y3plBnpVv3C_xB_kKv7F3lJ3oFv0G_8D_2L36Gv4Jn1F3sI3oF3vEnqD3vE_1En4B3rB_5Hv7FvpEnqDnqD_jDnqD32D_uF_5Hn8E_yI_1EnnHv-BnxC_8D32D32Dv-BnjEnf_8DoG3vEgyB3vEoqD39CgkD32Dw0G_qCw0GvlBwiF_YghHnGo8EAo1FgZwhX4SwrSvMg_Rnfw4J_xBw_InfwpEv-BwtH39C4lJvlB4zHviFw1N3zHw2Uv_Iw6X30O4wkBnjEoyJ3kC4oF_jD4zHnxCw7Fv3C4hGvyRo2lB3vEo5I_uFgsJ_vM41V33KwgQ_oNg4SngI43K_1Ew7F32cw4iB36GgzI_oNwyRv-Bw3CvlBgyBnyJ47N3wL4_QnyJwgQnrKwrS3rBoxC3zHg7OnqDw0Gv_IosRv0GooO_xBw7FnfojE_Y4kC_5Ho3TnnHo3Tn5Iw3b_jD4lJ3zHg5ZvwDwjMvtH42c3kC4lJvpEgqU39CwnP3vEo4anqDo7W_8DgsiB3rBwyRvlBo-Snf45YvMw_hBnG40OwMoiWwM4zHAo0X4S4gYvMolrBAw0f_Ywla3rBghgB_Yg-K3rBgjV32DgpmB_xBw1N39Co0X3kC47N_uFoghBn4B46G3SoqD3oFwjlB39Cg4SnqDw9T_8DowUvMo4BvtHo6oB3oF42c_5Hg7nBv_Ig4rB_-Rg2vCvtHw0fv_I4wkB_vMg1vB3tP4z5B3lJongB3Sw-B_gH4nXngIoqc_xBgvFvtHw-an1Fg1Wn2Mgo4B3vEoiWvtHwgpB3kCgiO_5Hoq1B33KoihDvwDwwcnjE42c3oFoghBv7FwtgB3vEg1W_9Kg5yBvjMwhwBviFg4S3hG48U3_Qw73BnhPoq1BnhPo4zB_gHgnYnyJorjBvwDg7O39CwuOv3C44Rn4BwyR_Yw8MvM4iNAgvF4S4mQw-BopVgyBo9LoxCwuO4kCw4Jw-BogI42D4iN4hGg4SghHo3TgpNgljBwmIo7WwqLwpdwlzB4ppEwjM4hfoxCw0Gw4JwhX4rBgkD4oFo9LosRg7nBw7FgwM43KopVw8Mg5Z42D4zHw7Fg3Lw-B42D43K48U4uWo3sBwiFw4Jg7nB42uC4gYg1vBw3CgvFo6PoufwvVwyqBgyaox0BovNoxbwsZg91Bw5Qo9kB4vEw4Jw2UwovBwqLotYgmRohoBgpNg6gBokLoqcw3CoyJwuOwnoBokLoqcw_I41V4kCwtHgrCwiF4-Jg1WoyJwhXwqLojdoiWwx8BouG44R4-Jgrb40O4toBokL4oeg8Vg-8B43K4oeoyJw-a4oFg7OgiOwgpB46G4jUo5Ig5ZoqDw4J46GgjVg6HwsZgoGwhXwiFgxTw3C4wLoqDwuOg9Do-Sw7FoufoxC4tP4kC40O4rBgsJwlB4sIw-BolSgyBg7O4rBgiOwlBg0P4kCwxjBoG46GwMwxKwMg-jBAo1FnGw7FAw3CA49CAgkDnGgvF3So-SvM4sI_xBw-av3CghgBn8EgtpBn1FgwlB_8DwhX_uFghgBnqDo3Tv7FohoBv-BgtQv3Cg2d3rBo7W_Y4_QvMgwMnGgjVoGooOwMgiOofw2UwMw7FgZ43Kw3Co8doxCgqUw3C4jUwiFojdwwD4_Qw-BgsJw3Cg3Lo1Fg8V4vE4mQg9Do2MouGo3Tg6Hg1W44R41uBgzI48U4vE43Kg9Dw4JwgQovmBo5IwvVo3Tw6wBonHg_R4oF4tP49CghHo1FwuOwlBoqD49CghHgzI41Vg-K4kbwgQ4imBgoGwuO4-J48UgvFg-KwqLgjVo5IwnPwgQomZgjVg2dgwM4mQo2MwnPwjMovNouG46G4lJ4lJ4lJo5IwpEg9D4vEojEgzI4zHowUosRwhXo-SwjMorK4pMg-Kg7OwuOgkDgkD4-JorKg2EwiFgoGghHwoWo4agvFghH4vE4hGw8MosRw_Iw8Mo1FgzIghH43KglKgtQojEw0Gw7FglK4pMo7Ww9TgmqBovNo1ewhX4h4BorKgrbw7FgtQorKojdg9Dg-KghH4jUo6Po3sBgrC4hGwwDglK4vEo2Mo8E47Nw7FosRo0Xg0hCg8Vw47B4wLoufw_IwzYg3LongB4pM4shBggyBwxnEojEwqL49CogIgoGgmRgrbg9uCwuO40nBwxKoqcg-jBwy8CwxK4kbg6HgqUg2EwjM4_Qg4rBoxCw0G49CwtHo5IwoW4vEg3LgnYwq9BgiO43jBo0Xw47BwmI48Uw6Xw_6B4iNwtgBw6wBgx3DwpdgxlCw7ewvnComZ464Bg7nBw83CggZ421BooOwiew3Co1Fw3bg65BorKgjVwwDonH4lJ4xS4oF43K42DwtH4-iB4qlCw8lB4npCo_Z4gxB4toBomrCoxC4vEgpN4gYw9TgljBwqLw9TohoBo3lC4nX40nBg4Soufg-KwrSwlBo4B41V43jB4qTouf4kbwrrBox0B4zyCwwDgvF45xBo4sCw-sCo33DgoxC4y9DgzhBox0BgyawgpB4uvB4gqCgofwsyBwhX4plBwqLo-SomZ44qBoxCojE4sIooO4wL4jUorK44RgyBw3Co4B49CgZ4rBg8VginBgpN4gY4_Qg2dw6X4_pBgoGg3Lg4SorjBwrSwxjBwpE4sIgveor8Bw5Q4liBg2Ew4J41Vo3sBw6XwsyBg0Pw_hBgwM49bwuOgljB4hGgiOgvFg3LoqD4zHo4BwwDg2Eg-Kg7O4shBw_Iw9Tw0G40Ow3C4hGw3CouGgrCwiFo8E43KovNwie4wLotYw_Ig_R4pMo0XgwMo7Wo5IwnPgsJg0Pg7OguXohPg1WwvV4oewiF46GgvFghHguXwwcgmRo3TolSo3TwjM4pMg4Sg_Rw2U4xSgpNokLgkcwvVo2Mo5Io7WohPwyRorK4vd4tPohP46G4hGw3C40Ow7F42DgyBwxK42DwrSouGg3LwwDo-So8EwqLoxCwrSwwDgwMw-Bg4S4kCo0XgyB4gY4SgtQAg_RAw6wB_Y4jUnGg6gB_Yw7FnGghHnGgrb_YwzxBv-BgtpBn4BgxTnfoytD_gHgqU_xBg2d_qC49b_qCggyBn8Eo1F3S46G_Yg2dnqDosR3rBgiO_xBg6Hnf4uWv3C4jU_qC4zHnGw_IvMglK_Y4oF_Y4wL_jDw7F_YoivB_uF4kbnqDoyJ3rBgsJnf4qTvlBg2EnGw4J3SgiO3Sg0PoGgtQofw6X4kCohP4kCohPw3CogIgyB47NgkDwvVw7F4zHgrC4tP4oFopVwmIw2Uw_I4qToyJgxTwxKw1NogI46GwpEo3Tw8MgpNgsJgwM4lJwrSwuO44RwnP44R4mQg-KwxK44R44RwyRolSg_RwkToqcgvewiFgvFo7WwsZgiO4tPg5Zwpdg_Rw2Uw3b4zgB41Vo_Z4oFgoG4oFgoGwpE4oFo8Ew7Fo1FghH4nXg9covNgmRgwM4_QwmIo9Lg3LwrSwtHgwMg-K4jUw0GgpNouGw1Nw7FgpN4lJoiWgvF40OwiFwuOonHwoWouGwoWw7Fg1WouG42c4hGouf4hG43jBgkDwkTgoGgwlBgvFgzhBojEggZw7ForjB4wLowmCw0G4toBwunB4twHgsJon5BwzxB4kuJojEggZo1FgsiBg9DgnY4hG4wkB42Dg8V4vEgnYgoGg2d4vEgxT42DgpN4kC4zH46GguXoqDorKwiFg7OghHg4SghH44RgzIo3T42DogI4iNgyagsJwyRwgQ4oe4hGokLghHw8MowUginBgrC4vE4rBoxCg0Pojd40gCg85DgrC4vEgZ4rBgzI4mQwuOgrb4-Jg4S47NggZgpN4nXwjMw9TovNowUwuO48UglK47NgsJ4pMwuOolS4_QgqUwyRgxT44R4xSg9Dg9Dg6Hg6Hw8M4pM4xSgtQg3Lw4Jg3LgsJo7WgmRwuO4-JgxTgwMwlawnPgpNonHo6PogIo2lB44RgpmBozQ4yZwxKwzYglKg_RwtHg8Vw_IopV4lJosqBo3TouGoqDouGgkDw0GwwDouGwwDwjMw0GwlawgQw1Nw_I4xSw8M4iN4-Jw9TwgQ4jUwyRovN4pMo6Po6PgnYg5ZgxT4uWgwMwnPosRg1W4-JovNg-KwnPw_I4iNglK4tPgsJwnPgzIgiOovN4nX40Ow-awqL41V4pMwzYo6PgzhB4oF4wLoqDonHgzIg4S41V45xBg9gEo1xJw7F47NwtHwyRgl1Cw-pGwnoBow_CgwMo8dotY4s6B4jUg1vBw3ConHouGooOwgpBwhiDwgQg7nBoqDgzI4kCgvFoxCgoGgvFg7OghHwrSw-Bo1Fg-Kwiew3CwmIg6Hg1WgkDw4JoxCo5IwlBgkDgkDgsJgkDorKgoGg8V4sIo1ew-BwtHgyBgoGwqLo7vBwmIovmBw-BwxKwpEw6X4kCw1NgyBwjMwlBg4SoGgvFnG4sIvM46G_xB4pM3kCwjM_xBwtHvwDo6PnfgvF3So1F_Y4wLoGo1FgZ46GofgvFofojEoqDglKw-Bg2EoxCwpE4oFonHgkDgkD49CgrC4kC4rBo8E4kCwiFwlBo1FnGoxC3S4vEn4B4vE39CwpEnjE4vE_uF4kC_jDwpEnnH47N39boqDn1Fo4BnxCgyB3kC49C_jDoqD_jDgyBvlBoqDv-BojEn4B4nX36GgsJvwDo4BvM4vE3SwpE3SwpE3S4vd_8DopVv-BgoG3SglK_Y40Ov-B43K_YoziCvpEonH_YgkDnGg2EnGg9DnGongB3kCo3T3rB4mQnfo6zDnnHw7F_YouGA4mQvlBwxK3SogI3SgzI3SgupCv0Gg4S_qCogInforjB_1EgtQnxC4_pB3zHwwD_Yw1N39Cg8VvpE47Nnfg5ZnqDg_R3kCg_Rn4BgnYv-BwgpB3kCov_B_Yw6X3S47N3S4wL_Yw6Xn4BosR_xBwvV_qCg0P3kC4uW_8DovN39CgupCn-So82B_6O43K39C4rannHooO_1Eg_R3oF46G_qC4zHv-B4hfv_I40O_1EgmRn8E48tB_hOokkBvqL47N_1Eo2M_8Dw5pB3iNw6X3zHgy-DnhoBokLvwD47NvpEo5Iv3C4vvCnmZgmRn1Fg1WngI42cnkLwhX_rJ47Nv7FonH_jDo5I_8DgqUnyJoyiB3_Q40OvtH40OngIwuO_5Hg1vB3kbwyRnyJ4gY_vM48UvxKgmRngIg7O36GgmRvtHw2UvmIgpN_1EopV36GozQ_1EwqL39CorjBn5I4tP_1E4qT36GwgQ3hGozQnnHwnPnnH4mQ3sIg8V3pMgvFnqDw9Tv8MgiOv4Jw4J_gHo6Pn9LwuOn9Lg-K_rJopV3qT45xBn0wBwrS_-Ro2-B3w9Boxb_xao6PnoOw2UvyRo8E_8D46Gn1F4nXvyRo9L_yIo9LvmIwqLvtHoyJ_nGglK_nGwqLnuGozQv_IoyJ3oFw_I3vEolSvmIgxsB_pUw_hBnhPoqc3pMw5QvtHokL3vEwxKnqDo2Mv3CgsJvlBorK3Sg3L4S4hG4SorKo4B4lJ4kCoyJgkD4vEo4B4lJojEwmIojE42D4kCg3L4zHwtHgvFwpEwwDgzI4zH4vEwpE4lJoyJw_IorK4vEo1Fw_Io9Lo23Co-2DgiyDwi7Eg0P48UwqLwuOwtHw_I46Gg6Hw1NwuOwmIogI4sIwtHojdotYg2E42DwlBofgyag8VowtBgwlB4uWo-S41Vw9TwuO47NwxKwxKggyB4yyBoiWwoWomyB4yyBwrSolS4lJo5Iw1No2MgxT4_Q4lJg6HwmhBgrbw3CgrCgveomZo9vDgm8Cw6X4qTojE49C47No5Io6PgzIo8EgrC43K4vEwuOo8E4mQg2EwllD49bwzY4zHwrrBo9L43KoxCw4J49Cg7OwpEooOg9D4tP4vEwj-B44RgtQ4oForKojEorKo8E4wLw0G4wLonHw-ag_RghHg2Ewt2Fop5DopVg7OgvFojE42D49Cw_IogIw_I4lJ4zHo5IghH4lJ4zHg-KoyJo6Pg9D46Go8Eo5IwmIohPw5Q4oegiOomZgvFgsJwvVg-jBw7FgsJgpNg8VwrS4oeg-K44R4mpBg4kCw0GorK4rawrrB46G4wLgzIgiOg7O4uW4kCoqD4vEghHorKooOovN4xS46Gw_I4uWoxbg_R4qTw4J43KwpEwiFghHw_Iw7F4sI46GwxK4hGwxKo1F43KwtHwgQ4vEokL42D4-JgvFozQw0GotY4kCw_IgrC4pMgrCgiOw-BgiO4kCowU4SglK4Sg_RoGgrbv-B4zrD_YoioCvMwrrBnf4rzBA4-JwMg8VgyB4vd4rBwnPo4Bg7OojEgya4oFg5Z41Vgx-CwtHg6gBwgQgqmCw9Tgp4Co1Fw-a4kC43Kw0Gg-jB4vEoqc4rBg6Hg9D4nXo8Eoufg9D45YgvFo1e4kCwnP4-Jwq9Bw-Bo2M4kCooOg8Vg-nE4iNo1wCw3CgmR4kC4iNgZg2E4S42D4SwwD4rBwmIo5Io82BgrC4tPoqDwkTwwD4xS4kCgsJ4oFw9T49C4-J49Co5Ig6HgjVg3Loxb4zHwyRgrCgvFw3CouG4rBgkD4kCo8EokL4yZ4iNw7e43KwlaoghB4-0Cg9D43Kg9DokL4rB42D4kC4hGogI41V4oFg7O4_Qw-zBw8MgtpBgzIgkcw3CoyJgrCgsJ4vEg0Po8E4xSoxCgsJg2E44RwtHwpdonHwieojEg_R4jmCw2gKg-Ko0wBo4BogI4kCgsJg7O4thCg4S4owCglK4xrBgkDgpNo1F45YgwlB43gFoufw4mEwiFwkTwwDwjMg9D4pMwpEgwM46GolSwtH44RgvFo9L4sI4_Qw7FokLw0G4wL46Gg-KwxKg0PorKw1NouGogIgkD42Dg-Ko9LgtQg0Pw5QooOgmR4iNw_IouGowxEwskDg0oBwpd4nXg_R4-JogI4oeomZwx8Bg91B42cg5ZgxTwyRglK4lJw0Gw7FwhwBg_qBw5Q4tPwpEg9DwjMg3LwwDoqDwla4ragpNooOwzxB4o3BwqLo2Mwieo5hB4-0C4q-CogIw_I4sIgsJ4jU48Uo8Eg2Eg0oBohoBog6Bw73B4vEwpE4-jIg56H48U41Vgz6BoogCg_R4jUw0G4zHo5I4-JozQolSgmRg_RovNovNg2E4vEouGo1FghHonH4-iB4liB4lJo5IongBgofwtyC4owCgqUgqUw73B4z5B4mQgmRw3_Dw4mEg1Ww6XwyR4qTwuOolSonH4-JgoG4lJgzI47NwlBw-Bo5Ig0P4oF4-J4hGo2Mg6HolSg6H4qTg2E4iNojE4pM4sIgrbouGwhX4S4kC4Sw-B4rBg2EohPww1B4_Qor8Bg9D47N48Uo7oCw7eojoDgiOwzxB4pM4jtB4uWwj3CorK4wkBwmI4kb4sI4raogIotYogIo7Wg4Sgr0B46Go-So4Bo8EwyRo0wBwjMo5hBgoGosRw_IggZgzIwzY49CogIgrb4rsCwpE4wLo4Bo8EwpE4_Q4rBw_InGwpE3SojEvlB42D3rBwwDv-B49C_qC4kC_qC4rBv3C4SnxC3S_qCvlB_qCv-Bn4Bv3Cv3Cv0G_Y32DvMnjEoGnjEgZ_8Dof32DgyBvwDw-B39ConHv_IgyB3rBofnfwiF3oFoqDnqDw0Gv0GwpEvpE4zH3sIooO30OwmIn5IwmI3lJgvFv0G4pM3mQwpE3vEwtH_rJwwDnxCgkD_Yw-BoG4kC4SgrCgyBw-Bw-Bo4Bw3CgrC4hGgZg2EoGonH3Sg9DvlBwpEvlBw3CnxCwpEnxCwwD_1Ew7FnxC4kCnqDoqDvlBwMnjE3zH_nG3pMv7Fv8MnxCviF36G37N_uF_vMwMv-BnG_qCnfv-B_Y3S_xBnG3-JnwU39C36GnxCnnH_qC_5H_xBv0G_Yr_EvMjuC_YngInG3wLgyB3kCwMn4BAvlB3S_qC3SnfvlB_YnfA_YwMnfwlB_YoxCAwlBwMw-BwMgZgZof4SoGwMg6HAw7FwlB4pM4rBonHoxCw4JoxCg6HgkDonHwtHovNgkDgoGvMo4BAw-BwMgyBwlBo4B4rB4SwMnGgZ3Sof_xBwMv-BojEn1Fo2MnzQwpEnjEgyBvM4rBoGo4BgZgyBwlBgyBw-BwlB4kCgZoxCgZo1F3SouG_YoqDnfw3CnqDw0G39Co8EvlBw3C_uF4zHvqLg0PnxCg9D32Dg2EnrKg3L_rJ4-JvvVg8V_1EwpE36G4hGviFwiF_xBgyBnjEw3Cn8EojE_qC4rB3kCgZ_qCoG3kCvM3kCvlB3kCn4BvlB_xB_Y_Y39CnuGnfnjEvMvwDAn8E4SvpEwlB_8D4rBnqDw-B39Cw-B3kCgrC_xBgrC_YoxCAoxCgZgrCgyBoxCgrC42DghHoxC46G49Co1FwpE4wLo4Bo8Ew3C4sIw0G4_QgzIw6X4pMw_hB4kC4hGo4Bo8Ew2Uw04BwiFw8MghHw5Qw4JopV4zHo6P49Co1F40OgyawxK4_QwxKg0Pw-agpmBwsrC4opD49CwpEg2Ew0Gg2dozpBwxKg0PovN41Vw_Ig0Pg-Kw2UwmIgmR4zHgmRo8E4wLoyJw6Xgof4hxCgjVg22Bg0hCgqqFgrCw7Fw_IguXgkDogIgkDgzI42DgsJgkDg6Hg9cggrCwxK49bgvFg7OgqUok9B4vE40OghHotYgmRg7gCgmjC4ljIg4SosjCwpEwnPot8D4j9Nw7FgjVokL40nBwpE4tPg_Rgp_BgzhBwv5Dw5Qo56BgsJo5hBo5Io1e4rBwiFwlzB4h1F49C4-JwwDgpN4vEwgQwjM4mpBw4J4oe43K4vd47N4-iBoqDogIongBo8vCghHgmRo2lBol9Co-Sg8uBwtHwkTg2EgpN46GowUwpE47Ng6H42c42D40OoqDohPw0GongB4rBonHgrC4wLwqLw73Bg6HoonBw0Gg6gBw2UgknD4_Qor1C4jU45jDgzIohoBoxCgwMghHgveo1Fg5ZosRw3tC42DwyRg6Hw4iBoqDohPw4JwksB4zH4-iBo6PwvnC4vEo3TgiO47_BgkDw1N4hGggZovNgk1BonH4rag2EozQouG4uWonH4gY44Ro82B4xSww1BglKgrbgtQ4_pB48Uww1BwuOg3kBoqDo5IwqL42cgrCouGo8EwjMguXw47B4xSwovBoqDwmIwMwlBo8Ew8M44Rw9sBouG4_QwnPgpmBgkD4sIgrCgoG42DoyJ4jUo4zB4kCo1FwtHgxTooOokkB4hGwgQo1Fo6PogI45Yw0G4uWojEg0Pg9D4mQ46Gw7eopVomkDouGwtgBojE4gYwpE4hfw3CwsZw-BwsZwlBgxTw0Go2pEg9Do5zC4rBw3bgoGgojEo4Boqcw-B45YgkDw_hBw-B44Rwlaw11GgyBo2MofwtHg9Dg5Z4vEwlaghHwtgBo7vBojsGw-B4sIgzIwjlBwpEo3To5I4qsBwgQw40CgiOwzqCg6HolrBgkDw5QojE4gYw-B47NgyB4mQ4SgzI4So5IoG4sIoGguXvM47N39CwklC_xBg-jB_xBgpmB_qC4k0B3rBgjV39C4gYn4B4wLnxCgpN_8D44RvwDovN3hGopVvlB42D3mQgv3B3sI4kb3iNgxsBn1F4qTnfwwD_8DwjM3pM4toB32Dw8MnyJokkBnxCglK39C4wLv7Fo0XnfwpE_qC4-J_jD4iN_1Eg8V36GoghB3lJ4gxB39CwyRvlBgoGvwDwvV_1EwxjB_qCwkTn4BozQ3Sw0GvlBoqcnGo6PoG47NwMovNgZw1NofovNofw_IwlBokLgyBorKgyBorKw-B43KgkDooO49CgwMoqDo2Mw7FwkTwuOgqtBgzIgyag2EwuO4kC46GgZ4kCo4BgvFwtHg1Wo9LwjlBg6Hw6X49C4lJwiFo6P49Cw_IgZw3CwMgyBghHguXgyBo1FoxCoyJgkD4pMw-Bg6Ho1Fwla4oFo_ZgZwpE4rBw0G4SgkDwpE41V4SogIojEwwcwlB46GoxC40O4S42D4S42DA4hGvMojE3S49CnfgkDnf4kCnxC42D3kCgyB32D4rBvwD3S_xB_Yv3Cv3C3rB3kCnfv-B3S39CAnxC4Sv3C4zH_qC44R_1Ew7F_xBgrCAgkDw3CgyB49C4So4BwlB4rBwlB4SgyBoG4kCAofnGgyBnf4rB_qC4Sv-BoG_xB49Cn4Bo4BvMgrCnfwpEnxCw-BvlB4kC_xBogIn1F4_QnrKw6X3iN43Kn1FgwM36Gw0G32DouG_qC42D3S4hGvMo4B_Y4lJgZ4rBoGorKwlBwwDgZwwDofw3CgZ4vEw-Bo1F42D4kCo4B_jDwjM_8Dg_Rv-Bo5I39CohP3Sw_IAgiOA4kCA4kCA4kCwMwvLoGgjGofolSofonHgZ42D49Cw8MoxCw4Jg2EgxT4kCg6H4vE4_Q4kCwmI4kCghHwlBwwDoxCo1ForKwkTwpEgzIgrCojE49Cg2EokLw9TgrCwiFgZojEnGwiF_Y4zH3SgyB3SgkDnfonHnGwqLwMwiF4SwwD4rB4vEgyB4vE4So4BwlBoqDwpEo2Mo4Bo8Ew3C4zHwpEo2MoxCwmI3hGonHvpEo1FnjEgoG_nGorKnqD4oFnuGg-K_vMopV36Gg-K39Cg2E39Co8E39CojEv-BwwD_5Ho2Mv3C4vE39Cg2EnqDwiFvlBw-BnjE46Gv-Bw3Cnf4rB3vEghH_uF4sInxCojE_1E4zHvuOwoW_kKozQnqDgvF_8DouG3rB4kC_qCwwDnuGwxK3yZ4mpBngIw8M3hGw4JnkkB4s6BnzQw-anjEghHvwDw7F3kCg9DviFwqLvpEwjMnqD4iN_qCovN3rBgiOvMokLwMgpNof4wLo4BokLw-Bw4JgyBouGoqDgiOwwD40O4xSoquCoxCwjMwtH46f46Gg2dojE4nX4kCg7OgyBgiOgyBwoWwM4lJoGwjMoG4xSAghHA4sInGonH3SwkTA4iN4SovNgZ4pMwlBw1NvMogIvMgrC_xBg2En4B49C_gHgkD_jDw-BnxCgrC_qC49C3kCg9Dv-BwiFnfg9D_YgvFn4BwyRvlB4hGv-BonH3kCgoG3kCwiF_kK4jU32Dg6H_qCo1F_xB4oF3sIgqUvmIgjV3lJgrb3oFosRvmI4hf3oFg1W3vEo7W32DwvVvwDgnY39CggZnxCgyan4Bgya_Y4xSvMo3TAowUwM4jUgyBosqBo1F4tzD4kCw9sBofowUw-BginBwmIg0lFwlBoxb4Sw-aA44RvM44RvlBg5Z_qCongBnxCgnY_jDotYnxCozQ_uFgve_1Eg1WnjEosRvpEgtQ36GgnYn8E4tPviFohPv8Mw_hB_gHw5Q3sI4xSvjM4gY_jcoq1B_g5B4ssDn8dou4B_gHgpN32DghHnyJg_R3rsC4jxE38tB4w2CnoOw-a31nC43nEnoOgyankL48Uv5QwmhBvjMg5ZvtHozQnhPgljBv_I4nXn5Iw6X_yIo0XvmI45YngIwsZv4Jw_hBn8EwyRv0Gwla_nGo_ZnnHoghBnyJo0wBvlB46G_1Ewie_jD4qTviFginBnqDoqcnxCoqcn4BoiW_xBwvV_xB4ravlBg5Z_Yo6oBAo3Tof4w9Bo4Bg49CAgsiBnfg-8BvlBg-jBnxCguwBn1Fg75C_1EwtyCn4Bo9kB3Sg-KnxCwj-B_xBg4kC3SomyBnxCg1sFAghHnGovN3Swx8BnGwyRnGwwcoG4_0D4kCwk3Dw3CghyCgsJg5hHo4Bg4rBg9DwohDo4BopuB49CwooCgkDgupCoxCw1_BoxCgs7B4rBg9cgZg4SwwDwj-BwlBwkTgkDg_qBo8Eok9Bo8Ew30BogIo_rCgvFgqtBgrCwrSojEwtgBw4J4xkCw0Go6oBghHginBo1F4kbo1F4ragoGgya42DgiOwmIw7eo1FgqUgrCwmIwiFw5Qo9L4plB43Kw7e43KojdgiOorjB4liB4vvC4lJ48UgoGohPggrCw6tFg3L4kbotYwt5BwqLgkco5IwzYgvFozQ4oFgmR46G4yZgvFg1Wg2EoiWwpE4nX4rBogIwlBwtHwwDg5Z49CwlagyBolSgrCg7nB4SwvVAwkTvMgmRvlBoxbnf4xSv3Cgve_jDgkcnjEwlanqDg4S_nGo1en4Bg6HvtHojdvpEohP_gH4uW_1E47NngIg8V3oFw1N3sIw9T3lJgxT3vE4lJ3lJosR3_Q4vdvnP4yZ_2Lo-S37NwoW_iVg6gB38Uw0f3xS4kb3nXg6gB30O4jU_2kBo0wBngIorKvmIglK_yI43K3jU4kb_3Sg9cv7FglK3wLgjV_9KoiWnjEg6HnvNwmhBv_IgnY_nGg4Sv7Fo-S3oFg4Sn8EwkTvpEolS_6OgigCv5Qw6pC3kCw_I_k8BgpnInzpBg2zF_pU474C_nGg5ZvmIwtgBn9LolrBnyJw0fv_Igkc_sQwhwB3oFg7O_hOw8lB_5Ho3Tv_IwvV38UoivBnyJg8V3lJopV3mQ4plBnnHosRn8E4pM_kK4kbv0GgqU_nGw2U_nGg8V_uFwvVn1F4gY_7Vg5kD3oFg5Z_jDgmRnjE45YnxCgmR_8D4vd3kC48U_zPwroFvtHw3tC3S43KvMg0PoG4xSof48Uo4B4jUofwmIoxCgmR49CwgQgvFw6XwpEo6PgrC4zH4oF4tPw_hBgq_CogsDouyJ43Kg2dwtHg4Sw_IgjV43KwzYo2Mgya4lJ44RwyRw0f4wLgxT4tPw6Xg91Bw3tC4hGgsJw7Fw4J4oFgzIghHo9LgsJozQgsJosRo-S47mB4lJgqUw_I48Uo1FooOw7Fo6PoxCouGogI4uWglKo1e4lJoufg4rBwm-EwtH45Yg-KoghBo5IgnY4hGwgQoqDogIouGg0Po6Pg-jBopVwhwB4mQokkBgoGgiOgtpBwy8C4sI4qTwiFovN4vEwuOg9Dg7O4vE4nXgrC4mQ4rBgtQ4SozQvMggZvlBgtQ39Co7W_xBgzInfo1F_xB46G3vE41V_YoqDnxCg3Lnf4vEv3Cg3LvpEo3TnjE48UnqDgjV_8D43jBn4Bg8V3rBgnY3SwhXgZg3kBgZwkT4kCo0XofwxKgrC4jU4oFwmhBoqDw5QgrCorK47N4w9B47Ngl8Bg-Ko7vBo8E48U4hGoqc49Co2Mofg2EoxCg3LgkD40O4kCorKo5IozpBgrCw8M4kC4iNgrC44R4kCozQw-B4nXwlBguXwMgofnGogInGohPnfgxT_xBwkTn4B4mQ39CoiW39Cg_Rn4B4-JnjEw9T3rBgoG39Co9L_8DohP_rJo8dv-B4oFn5Iw6X36Go6PnnHg0Pn5I4_QnhPw-a_lRw3bnlS4kbn9kBww1B3xS42cnhP45Y3mQwwc_5Hg7O3tPgvevuO4hfvgQwjlB_2Lw3b_rJowUnxCo1FvmIg0Pv3C4oF3sIgiOvmI4wL_yIg3LvjMw1NvrS4qTn1F46G3zHgpNvpEo5I39C4zH_qCg6Hn4BogI3rBogInfoyJvMgzIwMo9LwlBwqL4rB4zHw3CorKg9D43K49CouGo4BoqD42D4hG42Do8EojEg2EwpE42DwpEgkDoxCgyB4oFgrCo8E4rBg2E4S42DAw-BnGw7F3rBw5Q36GgvFn4Bg9D_Yo8EnG42DwMg6Ho4B4vE4rBo3T4wLw-BofgoGg9DohPoyJ4gY4mQ4_Q4wLwiF42D4uW4mQg0Po9LgqU4tP4iNorKw_IghHo9L4-JoqDw3CgnYg4So1FwpEoxCw-Bo4B4rBwvVwgQo1FojEo1FwpEgvFg9DgpNo5Io8EoqD4_Q43K46fwrSgsJg2EogIojEowUorKwlao9LoogCw3bojvCgzhBwj-Bo4a4uWorKohPwtHokL46GopV47N46Go8EgmR47NgjVgqUg0PgmRogIoyJghHgzIg-K40O47N48U4iNwvV4pMg1Wg3Lo0XwmIwrSg6Ho-SwqLo8dgkDoyJwxK43jBwwDgwMgzIw4iB4-JwrrB44qBo0mGwlao76Do8d4iqE4hGoxb4sI47mBw3Co2MouGo1eo9L4h4B4wLgo4Bo1FwwcwiF4ra4vE4uW4oF4kb4-Joq1BohPo23CwlBghHo4BwxKo4BwxK4vE42co4B4-Jw7FoghBgyBw_IofgvFo4BglK4vEo7WgzIosqBw-B4lJgzIwxjBoxCoyJouGgnYoqDwqLg6Hg5ZwlBwwDgkD4lJg2EgiOgzIgnY4vEg3L4vE4wLglKwzYof4kCgrCwiFg9Dg6H46GooOwqLomZ42D46G42DonHwuOw3bo8E4lJgrCo8EonHg3L4sIg0Po6PgrbwzYg4rBwtHgpN4vEonHojdwsyB4zHgiOwiFw_I42D4hGw0Gg3L4wLgqUw8MguXo4Bo1FgyBgoGwM49CAwwDvMgkD3rB4vE_YgyBvlBgyB3rB4rBn4BwlB32DofnqDn4BvwD_8D32D_nGv0G_2L3oF_yInlSnuf_jD_uFnqDonH3kC4vE_8D43Kv3Cw_I3kC4lJnxCovN_jD4qT_uFw1mBn1FgwlB_rJgmjCvpE4yZ_8Dg4SvlBg2EnqDo9Lv-Bw7FnxC4zHv0Gw5QngIo3T3vEwjMnjEovN_jD4wLnxC4-J3rBw7Fv-BokL3kC40O_xBgtQ3Sg6HvMwtH_Yo6PvMouG3SorKoGozQAonHoGwwDAg6HoGo8E4SgmRwMg7OwlBwiegyBozQwlBgzIgZojE4Sg9DwlBw0GgyB4sIgyB4zHofw0GwlB46Go4BgwM4vEoxb49CwgQw0Go2lBwMoxCo4Bg-Kg6HggyBofw0Gn4Bg2E_YofvlBoG39CvlBv3CvlBn8E_Y_jDvM_qCnGvwDA3oFvM3hGnf_YAnfnGvlB4S3Sof3So4BAo5IoG4lJoGgoGgyBoxboG49CwlBoyJ4Sg9Dof4hG4Sw0GAo8EoG42DwM42D4S42DwlBo8EwlBoqDgyB49C4vE4zHgkDgvFof4kCwlB4kCo1FgpN49C46Gof4kCg2E43Ko4BojEw-BojEo4Bg9DgZw-B4kCg9D4rBgrCofoxCwM4kCwMw7FgZwwDwlBgkDwlBo4BgyB4kCg9DwpE39Cg6H_YgrCv3CwtH_8DogI_8Do1FvwDwiF3rB4rBn4BwlB_xB4SvlBwM_1EgZnG3rB3SvlBvlB3SnfoGnfofvMgyBA4rBnxC4S_vHkIgwHjIoxC3S4So4BgZgZgZoG4rB_Y4S3rBoG_xBg2E_YwlBvMgyB3So4BvlB4rB3rBwwDviFw3C4vEwpEghHg2EwtHoqD4oFg9DouGoxCwpEojEwmIw3CouG4oFw1N4kCgoGwiFgtQ4rBwiF4kCogIgZoxC4kCo5IgyBg6HgrCgmRwMw3C4kC48U4kC45YwlB4mQ4Sw0GwlBgpNwM4hGwMw0Go4Bg_RwMgoGoGw-BwM4hGgZovNgZ4-JwMw7Fof4wLoxCojdoGw-Bofg3LwlBo6P4rB4_Qw-BwhXgyBo-SwlBohP4rBgtQofwjMoxCoxbofohPwM4oFwMgpNoGo1F4S45Y4Sg-KAo4BoG4vE4rBwksBwMo9LAwlBoGwwDA49CoGonHoGouGoGgvFwMorKoGwmIwMw8MwlBgjuBofw6XwlBgqUwlBwnPAgZofoyJoqD4nXo4BgsJoqDwnP46GwzYg2EgiOo8Ew8MogIolSwiFw4JwtHgwMgvFgzIgzI4pMw0G4sI42c4zgBglKo9L4oF46Gw8MwyRw3CwpEglKo6P46G4wLw0G4wLwgQ4kb4sI47NoqDo8EoyJo2MorKgwMogIwmIwqLgsJ42D49CouGo8EwxKghHgoGwwDg-K4hG4oFgkDo1Fg9Dg-Ko5IghHghHw7F4zHouGoyJgkD4oF42Dw0GwxK4xSojEghH4sIg7OgyBw3CgvF4-Jo0wBw83CgiOomZooOwsZ40OwlagzIohPo8EwmIwwDw7Fo4Bw3CouG4sI4zHoyJojEgvFwpE4vEwwD42DouGw0Gw0G46GwlBg2EwMoxCA46G_Y4kC_xBouG3SwiFAg9D4So1FgZ42DgZgkD4kCo8Ew3Cw7FojEwtH4rBwwDofwwD4SoqDwMojEAgpNv0Go4zBvpEw_hB_jDg2dv3Cg5Z3lJ49mDv0GolkCnoOou8EnqDgljBv-Bo-S3vEosqBn5Io_rCnfgzIv3Co_ZnxC4jUvlBwmIvyR4q3Dv5QwllDv0GwjlB3hfgywFv7FwmhBn8do-oFviF4vd3-Jgo4B_rJg91Bv0GgwlB3oFwpdngIw9sB3oFo8dv-Bg3LvwD48U_nG4imB_qC40O_uFokkB_qCohPnuGwksB3zHgh5B3hGw6wB_nGoq1BnuG4p-BvmIwg7Cn1FgysC_uFok2C_jDg65B_jDwrkCvpEwnzD3kC44jCnfo2-BvMgnYAgjVoGghgBoGgnY4rB4s6BoxCwrkCoqD4s6BoxCwjlBojEgyzBgoGgmjCwtHgmjCo5IgtiCwmIgo4BgsJgz6BogIoivB40OgkuCw_Iw9sBw6XonrDokLoivBg4SgjnCgiOwzxBouGoiWg-KwqkBw7Fg_RglKw0f4vEovNoiWw1_B43Kg9c4mQ4xrBoqD4lJw-BgsJwlBghHwMouG_qCo6PnGg6HoGw0Gofg9Do4BgoG49CgoGwwDgoGgkDwiFo8E_5Hw0G_kKo4B39Co1Fv_IwlBv-B4oF3sIgvFn5IojEnuG4hGn5I4hGv_Io2MvqLw4Jv_IwpEg3Lg9D47No8EgiO_5HghH36GonH39Cv_Iv3C_yIghH_nG_gHgoGw3CgzI49Cw_I46GnnHg6H_gHn8E_hO_8D37NvpE_2Lv4Jw_In2MwqL3hGw_I3hGo5InjEouG_uFo5I3oF4sIvlBw-Bn1Fw_In4B49Cv0GglKnjEw-B_8DgZvwD_nG39C_nGn4B_nGoGvtHofnjEwlB_qC4rBn4B4rBvlBgyB_Y49CoG4rBgZwlBwlBgyB4kCg9D4hG4oF4iNo8EwqLogIw9T47N4liBgqtB43uDwvVww1BwnPovmBgyagxlCgvFohPolSwlzBonH48U4sIwlag3L4wkB4vEohPg0Poj2BokLosqB4lJgwlB4pMw30BgzI4mpB4kC43K4wLw8-BgxToz0DgyBgsJ4rBwtHwwD4xSwlB4hGw7Fg9c46G46f4-Jw5pBg3LowtBw7FgjVw1NowtBw0G48Uw_Iw-a4tPwrrBorKo4agsJguX4wLoxb4xSozpBw_hBwooCw9TolrBw8MgofgsJguXo5I4gY4sIwzY4zHomZghHg5Z4zH4zgBgvFo4aw7FgzhBg9DoxbgkDgrboxCoxbgyBw3bofgyawMw4JAwtHA4qT_YorjBv-BorjB_qCgkc32D4-iBvwDoxbn8EoyiB_nGo6oBnoOgp4C3-Jon5B_kKgo4B_zP4szC_5HwunB33Ko_yBn4BogIviFg1W_8DosR_8DwgQ_8DgtQ3rBw7F_YgkD_hOgr0B_2LgtpB_gHguXngI4ravpEo2M_xB4vE3vEwuO3Sw-Bv7F4_Q_qCghHvpEo2M_uFo6P_gHwrS3wL4oevmIw2U3hGg7O32D4lJ3_Qg0oB_lRgpmBnlS4imBvrSo9kB3mpBwpvCvwuCwz1E3oFglKvjM4nXnnHovN3wLoiW_jD4hGnwU47mB39CgvF_qC4vE30Ow3b_5HovNngIwjMvpE4hGvwDg2E_5HgsJ3pMovN3vEwiFv3C49C3hGghHv1N40O_rJ43Kv7F46GvrS45Y3vEw0G3oFogI3oFw_IvpEwtH_vMw6Xv_IwkT_yIgqUv0G44RnjE4pM_xBo8E3zH4yZ3oF4qTviFoiW_jD4tPnjEwhX_1Eouf3oF47mB32DoghBnxCgnYvlBg3L_8DolrB3kC4kb3rBgtQnqDg91Bn9Lwi0F_8D41uBviFgv3B3vEopuBvpEoonBv0G4s6BnuG4k0B_yIo99BvmIgk1B39CwyR3sIwksB_xB4zHnjE4xS3zH4hf_gH4yZvmIw3bv0GopV_8D4wLn5IwzYv7Fg0P_kKomZ_kKo0Xv0G40On2Mo_Z3iNggZ_yI4tPnvNg1Wn5I47NnvNgqU3-JgiOvnP4jU_kKo2MnrK4pM34Rw9T_2LgwMvkTo3Tnu4Bwp2Bn1eo8dn7Wo7W_hOwuOvxKg-KnzQ44RntYgya3wLo2MntYw3b3kbw0f3wLgpN_8Do8Ev3CoqDn8E4hG_lqBww1Bv0Go5I3wL4tP_2LgtQ_sQo0Xn8EwtHnkLosRvjMo3Tv4Jw5QnkL4qT39CwiF3kC42DnrKo3T_2L4uW_qCo8E36G47Nn2Mw-avkTo-rB3_Qw5pB37NwjlB30O44qBn6PwzxB3vE47N3-Jo1enrK4zgB3mQ4rzB_2LgljBvjMgzhB3-Jwla_kKomZvxKwzY30O4zgB3vE4-J3nXg8uBv_IgmR3tPw3b_nGg-K_6O45Y_kKgtQ_vM4qTvgQguXv9Toxb_uFghHv8Mw5Q3lJg-KvpE4oF_pU4gY3hG46G3zHg6H34Rg4Sv5QgtQ_yIogI37NgwMnzQg0PvuOo2MnrKw_Iv9TgmRnqDw3CnqD49C__YwvV3iNokLntxB44qBn7W4jUnziCwt5BnsRohP_m8Dg6rD30OgwMvxK4lJ_qCw-Bv7eo4antYwhX_qCoxCn4Bw-B_rJorKvmI4-J_9Kg7Ov4J47N3lJohPvmIwnP_gHooO33KguX_gH4_Q_nG44R_5Hw6Xv0G45Y39Co2M_xBgoG_nG4zgB39Co3TnjEwqkBvlBwjM3Sw7F3vE4nwBnxCwwcvwDw5pB32D44qBnxCg2dvlBw8M_jD4liB_qC4gYnqDoonB3Sw0GvM4oFvwDo2lB_qCw3bv3Cw0fn8Ew30BvlBgpN3SonH_xB4_Qv3C4zgB_jDo5hBnfg3L3rBwxK3rBw4Jv-BovN_nGo5hB3sIo9kBn5I47mBv4Jw5pBnvNgz6BnyJ4mpBnkLo0wB_1EwzYnGw-Bv3Cg4S_xBo2M3rBgiO3So5I3SolSAg4SnGglKAg0PvM4iN_YwtH3S49Cn4Bo8EvlBw-B_qCgrCv-Bofv-BoG3rBvM_qC3rB3kCnxC_xBvwDnfvpEnG32D4SnjEwlB32D4kCvwDgyB3rBwlB3SwlBvMw3CvM4zH3SoxCwMwtHofgkDgZ4zHw-BwtHgrCg9DgyBwwDgyBgvFgkDw-Bofw1NwxKghHonHouGg6HwwDg2EojEgoGw_IgiOglKosRglKgtQ4-Jw5QwmIooOgwMw2UgrCg9Dg2Eg-K49Co1FouG47Nw0Go6P49CgoGonHwrSvlBoxC_xBgkD32DghHv3C4oFnxCwiF_1EgsJv_IozQnqDojE39C49CnxC4rB39CwlBvnPwwDvtHo4B_qC4Sv3CgZ_kK4kC3hG4rB3mQ42DvwDof_yIoxC36G4kC32DwlBvpEgyB36GgrC_jDwlB_xB4S_nG49Cv-Bof32DgyB_xBgZv3C4rBvwDo4BvwDgyBvwDo4BnuGgkD3vEoxCvwDoxCviFg2EnjEwwDvwDoqD3kCw-B3oFo8E_1EojEvqLglK_2Lg-K_vMorKv-B4rB3oFg9D33KonH32DgyBn8EwlBnuGoG_1Eofv3CnqD39Cn4B_nGv3Cn8E_qC3zHv3CvpEvlB3vE4kC3rBofv3C49CoGo1F4SoxCofoqDw-BojEwwDw_I4rBwiFo4BgpNwMo1Fof4zHgyBghHof4hGoG42DoG42D3So8E3S42DnfgkD_YojE3Sg2EvMwiFAgoG4SghH4rBg6H_uFg2E3kCgrCn4BoxCv-Bg9DvlBw3CvlB42D3rB4zHvlBglKv_DkvYvzEsoc36G3vE3hG32DnqD3kCvpEv3CnvNnnHv_I_1EnqD_YnjEoGv-Bofv-B4rBv-B4rB3kCgZngIoG_uFnGnG32D3rBn5I3rBn1F3rB3vE3vE_6O3vEv5Q3kCvtH_xBnnHnf_nGnG3kC_xBnyJ3SvpEoG_1EnGnxC3rB3sIoG32DnG3kC3Sv-Bnfn4B_xB_xBnxCvMvlB4SvlBof_YofvjM_xB3rBnG_8D4kC3SwlBvM4rBnGgrCnGw7F3SwjM_xBgzhB3S4lJ3S4lJnGghHvMwtHvMouG_YwjM_YonH3rB4sInfg9DnxCghHv-BwwDn8E4zH_1Eo1FnjEg9Dn8E4vEn1F4vE_uFg9D3kCgyBvtHo8EnjEw3C_YwM_1EgrC_jDof32DwMnxCvMnqD3rB_jD3kCnxCv3C_jDn8E3rB3kC39C3hGnqDngInf3kC_gHvgQ3oF_5Hn1F3hG_hO3tPnjE3vEvwD_8Dv-Bv-BnqD_8D36GvtH_1En8EviFviFvmI_5HvwD39C32Dn4Bn8En4Bv-BnGvpEA_qCoG3kCA_pUgZ_yIwMn8EoGnjEnG_1E3Sn1F3rB_nGnxC_xB3S_gHnjEviFvwDn8EvwD3SvMv3Cv-BnvNv4J39C3kC_8D39Cv7F_8Dv-B_xBvwDwmI_8DglK32DwjM_1E41V_YgkDn4Bg2Ev3ConHn4BouGnfo1FvlBgzIvMo8EvMwtHoG4zHAgkDgZg-KwwDo8do4Bo2M4Sw8Mof4yZoGwwDgZolSg2EwmsDw-BwovBwlBo1ewMw_hBnGg_R_YwrS_xB4uW_8DgpmBvlB4zHn8Egof3vEguX36GoghBv7FotYvwDgiOn1F48U3vE40O3SoxCvtHgnY_kK4hfvnPw5pBvpEorKnyJguX_zP4-iBviFoyJnlSw_hBnuGokL3rBgrC31VokkB_rJ47N_-Ro_Z_xa43jB_qCwwD3mQ4jUn9kBwyqBv8M40O3_Q4xS_kK43KnkLwjMv7FouGnuGonH33KgwM_kKwqL3yrCg6yCvgiCg8nC_xzBw04BnpVwhXvpd4zgBnnH4sIvkTo7W_hOg_R38Ugkc_oNo-Sn9Lg_RnsRoxb3tP4ranvNotY_sQo1e_9jBw9lCv3bgr0B_-RghgBn9Lw9T_rJg7O_kKg0Pn8EghHvpEgoGnqDo8E3tPg8V_-R45Y_nfw5pBntY4shBnrK40O3pMolSvyRw-a_vMowU_rJwgQnrKolS3-JolS_-RorjB_1Ew4JnhPw0f33K45Yn9Lw3b32D4lJ3vEwqL_1EwjMvxKojd_8D4wLnyJ49b_qC4zHnnH4nX39CgsJ36Go0X_qCw_IvmI4hfviF48U3SoxC_2Lw-zB3hGgve_Yg9D3rBghHnxCwnPvpEwsZv3Cw5QvwD4uWnqDwzY3rBg3LnqD4kb_8DovmB_qCojd_uFw_zC32Dw1_BvpEo99B3rBwnPvpEwyqB_1Ew1mBvpEghgBv3C44R_5H490B_8D45Y_8D4yZn1Fo9kBvwDggZ_jD45Y_8DgljB39CoghB_qCw7evM4zHv-BwjlB3SwyR_YwnoBnGozpBgZgpmB4SgtQw3C4rzBoqD4jtB42Dg0oBwjM4q3DwwD4toBoxCo5hBgyBw3bw-Bg8uB4S43jBAoonB_Y4mpB3kCg_8CvMguX_Yw0fnGwieoG4iNwMgofwMo7Ww-B40nBojEo2-Bo4BwoW4oFoj2Bo4Bw9To8E45xB4rB4uWwlBgrb4SgsJ4S4lJwM4yZ_YgwlB3kCw8lB3rBo-S_qCowUnuG4nwBv_I4h4BvkToruD_2LgxlCv4Jwt5B_uF4shB_gH4_pB3lJw04B3zHosqBvMw3Cv7F4toB3kCopVnxC46f3Sg-K_YwsZvMwrSA4wLAw0Go4B4_pBw-B4gYw-BopVofgsJoxColSo4Bo2MwpEg5Z4kCwxKgkDgtQg9DosRwlBo1FwlBo1F4rB4hG4zHoghBwpEowU4kCgwMwpEwsZgyBw8M4kCgjVw-B45YofwsZoGoxbnGonHnfoiW_xB4qT_jD4oe_qCgtQ3kCg3L32D4qT32DozQ3zHg2d_xBo1FngIggZv0G44R_5HgxTnjE4sI_uF4wL_gHw1N_8DghH_uF4-JvmIgpNnrK4tPn-Swpdn8EwmI_uFw_IvjM4uW_rJo-Sv1No5hBnuGwkTnyJ4hfn8Ew9T3vEw2UvwDw9T39CwhXnqDwtgBn4Bo-SvlB40Ov0Gw_zCn4BggZ3rBosR3S4sI_xBwrS39Cgve3rBgxTn4B4xSnxC4qTvpE4uW39CgwM3vEgtQ3vE47Nn8EovN3oF4iNn1F4pM3lJosR3wLg4S_4Z40nB3wLwyR3vE46GvjMg4S_1dowtBviFwmI3lJwgQ_1EwmInrKw9T39C4hG_xBoqDv3CouG3lJ4nX_uFg0P_8D4pMvjM40nB39CwxKvwDo2MvmIo5hBvlBg2E32DgtQv0GgljB_Y4oF3oFgwlBnfo5I3Sw0GvlBglKvlBgiOnfooO_YgiO3SozQnG4-JoG4mQgZwxjB4rBorjBgZg7OgZwuOwwD44qBg2Ew-zBo4B4kb4S49bnGgiOvlBwhX_YgsJ_qCw9Tnf4hG32Dw2U3hG42cnnH4hf_nG4oen4BgsJ_8DwoWnjEgkc_qCwrSnjEg0oB_kKoi6DnjEw-zBnGgyBvM4oF_vM4s-E_Y4-J_YwjMnf4nXnGoiWwMwoWwlBwla4SokLo4BgwlBgZwlaoGozpBnGoyJnfwiFn4BohPn4BwmI_qC4hGnxC4oF3vEwtHnxCw3CnqDgrCv7FghH39C4vEvlBgrC_qConH3rB46GvMojEnGoqDoGojEgZouGo4B4zH4kCw7FgyBgkD49C4vEwiFg2EgrC4rBwiF4kCgvFwlBw_IwlB4lJo4BoqDgZgoGgrCo8EoxCg6Ho1FgvFgvF4kC49Cw7F46GoxCwwD4oF4sIgiOwzYo6PwsZ49Cg2EogI4wLg6Hg-KosR4uW4pM4tPg2Ew7F46Go5Ig3LwnPg6HwqLg3LgmRo1F4lJgvFgsJ4sIwnP4xS4plBgzI4xSo1FgpNg3Lwieg9DorKwxKwtgBw0Gw6Xw7F4uWwpEg_Rg2EgjVw3Cg7Oo1FgsiBgkD4uW4kC4jUgoGgxlCoxCo7WoxCg4SwwDg4Sg9D44RgZ49C4SgrCgyBw7FoqDg-K4zHggZgrCgoGw-BgvFw0GgtQ4hGgiOgvFo2MgkD4zHwpE43Kw-Bo1FgrCo1Fo1FooOgyBwwDo5Io3Tw-Bg2EouG4mQ49CghHglKotYgsJguXglKgyao1FgtQwpEovNg2EwyR42DozQ4kCg3L4kCo6Pofw4JwlBglK4SgsJwMowUA44RvlBosR3rB40O_xBw8M3vE4oenxCgtQvlBghHv-BwjM_jD4vd3Sw4JnfwnP3Sg0PAonHwlBwjlBo4BwsZgyBw8Mo8EgsiBwpE4qTojEwgQoqDg-KwwDorKwpEwqL4vE43Ko8Eg-K4uW48tBwtHwnP43Kg8VgrCo8EghH47No1Fg3LglKopVgkDgoGg3Lo_ZghH44RghH4qToqD4-Jo1F4jUw-B4sIg2EwhXouG4mpB4hGginBwMgkDgyBg-KoG4rBoG4rBoxCw1NwMw-Bw-Bw_I49C4-Jo4BgoG42DoyJ4kCo1FwtHooO4oFw4J4hGgsJojEo1Fw7F4zH42D4vEg6Hw4J4wL4iNwpEojE47Nw1NwlBofgzI4sI49C49CwiF4oFgwMwxK4_QwuOwxKw_Io4Bo4BwmIwmIouGghHwjMgiO4hGwtHwiFg6H49CwiFojE46G4zHw8Mg0Po0XouGwtH46GouG46G4hGgpNwqLgiO4wL4uW4mQ4tPwxKghH4vE4wL4zHghH4vE4kCgyBw7Fg9Do5Iw7Fg2EoqDo1FwpE49C4kCwnPg3Lw1NglKgyBwlBgyB4rBgZ4SgZ4S42Dw3Co8Eg9DwxK4zHovNglKwoW4tPwmIwmI46Gg6HwwDg2E4zHokL43K4mQw7FglK49C4oFg6HgsJonHgoGw-Bo4Bw3CoqD4kCg9DofoxC4S4kC4SojEvMouGnxCwqL3rBgkD32D4lJvwDo5IvwD4lJ39Cg6H3lJ4nX3zHgmRnjE4sIvlBw3CnuGooOn8EwmI30O4vdviFw4Jv-B42D3oFg3LvtHgiOnfoxCvmIg0PoxCojEo4B_qCojEvtHoxC3oFgZ_xBogI_zPwiFnyJoxCviFATw7F7pL49Cn1FghHnoO4wL35YojE_yIogIv5QwiF_5Hg9D36GwiFnkL49C3sIw3Cn2Mw3C_zPo1F_hOw3Cv0Gw0G_oNoqD3oFo5IvxKo1Fv7FwjM_9KooO3iNg3LnkLgiOn9LoqD_jD46Gv7FoxCn4B4oF_qCg9DvlBwwDAo4BwMoxC4rBojEgrCgsJg2EglKwiFoqDof4sIgrCg7OgkD4hGw-Bg3Lg9D4vE4rB4lJw3CojEwlBo8EgyBwtH4kCw7Fo4B4vEw-BgvFgkDw7FwwDwiFojEglKgzIwyRopVgnY4oewsZoxbwtHwtH4-JwmIorK46G4vEgrCwxjBwyRokLgvFg2EoqDgvFg9DojEoqDoqDgkD4vEwiF49Cg9D4hG4sIwiFg6HoxC4vEgzI4tPg9DghH4mQg2dgoGokLwwDgoGoqDo1Fg2EonHo1F4zHg9D4vEwiF4oFgsJg6HouG42DwiF4kCw7Fo4B4zHgyBw4Jo4B49Cw-BwwDgyBojEgyBo1Fg9DonHw_Io4BwwDw-BgoGw3CgwMgZwtHwlBogIvMwqLnG4toBoG49C4SonHvM4_QnGogIvMw4JvMo6P3S4tPnG4sI_Y4gY3rBw5pB3rBolrBv-B4qsB_qC47_B_1Ew60E_xB47mBnfg-jB_xBwksBn4B4mpBvlBgtQnfwuO3rBgpNn8EwjlBnjEgnYv0Go5hBnjEgmR_8DwuOn1FgjVngIo_Z3wLongB_5HgjV_qbgw-B_vMwien4BoqD3-JoiW3nXoq1B__Yw73B32DogI_kKwzYv_I4jU36G47N_hO4ra_rJg0P33Kg0PnuG4sI_9KgpNvwDwpEv7F4hG_rJgsJ_zPooO_2LwmInjEw3CnjEoxC_rJgoG3mQ4lJvrSokL_5H4vE3pMw_I_uFwpEnjEoqD_5Hw0GnrK43KnoOo6P3pM4mQv3CwwD_8D4oF30OopV_uF4sI_uF4sI33Kw5Q36GwxKv7Fw_I33K4_Q3rB4kC32Do1Fn6PotY_8DouGnjEw0GvpEgoG30OwoWv4Jg7On5I4iNviFwtHvwDgvF3wLg_R3kCoqD3vEghH_rJwuO3lJg7O_yI47Nn5hBww1B36GokLn8Eo5I3rBgrCv-BojEnfw-Bn9LgnY39C4hGvtHwrS3zHgjVv0G41VvmIgkcn4Bo5I_uFg2dn8Eoufv3CwzY39Cw_hB_Y45YnG4tPoGovNwlBw6wBgrCo56Bo4B4yyB4SguXwMwpdoGomZvMw6X3SgxTv3Cw04BvMwtH3Sg6H_xB4gYn8Ew-zB_jDgkc_jD4nXv3CozQnxCovN_jDwnP_jDgpN3vEwyRngIo4a3hGosRv7F4tPv4Jg1Wv7F4pM36GgpN_jDw7F_nG43KnuGorK36GorKn1FogI_9KooO36GwmIn5Iw4J3xS44Rn5IonHn8E42Dv_IouGvmIgvFvtHwpE3-JwiFnqco2Mn4a4wLvtgBg7O_riBg7Ov3CwlB3wkB4mQviF4kC_7VgsJ_0Ww4JngIgkD_yIwwDv_IojE3-J4vE35Y43K_oN4hG3_Q4zH3vEw-Bv7FoxC39C4rBn1FoxCv0G49Cn9Lw7F36GojEn5I4oFn5Io1FvmIgoGnhPgpN3oFg2E3sIo5Iv_IgsJnrKgpNvtHgsJviFghH_hO4jU_6Og8V_1E4vEv7FonHn1Fg6H_jD4vE_9Ko6P_9jBo13BvyRoqc_jDoqD32DgkDnxCo4BvlBwMv3CoG_xB3S_xBnfnxC_qC_xBv3Cnf_qCvlB_8DvM3kCnGviFwM32DgZ32Dof39CgZ_xBgrCnqD4kCv-BwwD3rBofA4kC4So4BwlBw-Bw-Bg2EouGoqD4zH4vE4wLwtHgxT4mQ4qsBg3L4hf4hGohPg9DwxKgsJ4nXwwDogI4vEghHg9DorK43KgkcwxKoxbojEg-Kw3ConHg2EgwMgtpBgzsD44Ro0wBojEo9LwiFgtQg2E4mQg2EosRg9Do6PgzI40nB49C4mQ49Cg_R49CopVw3Cw6XwlBwqLof43Ko4Bw-a4SovN4SgwMoGo1FoGgvF4SwkTwMouGgyBw-zB4rB44qBoGouGoGgoGoGw0GoGouGwlBw0fofgrb4Sg3L4SozQoGwtH4S44RwlBongBwM4iNgZg2d4Sg4So4B48tBw3CwksBg9D4yyBoxCgkc4vEg4rBgiOw_lEgZwmIwpE44qBorKg_8C4vEg0oB4shB475JonHw73BgzI4v2Bw0G47mBg2EomZgzIozpBw4JozpBgtQwugCwqLwnoB46Gw6X40Ow9sB40Og_qBwnoB47xDolrBot8DgxTgv3Bw-BwiFwhX4miC42D43Ko4ao4sCg6gB4x9CohPgxsBw_hBwohDg5ZgupCwpEo9L4sIwzYg_Rw-zBwyR45xBgkDgsJwrSgk1Bw1NginBwjMw_hBgkD4sI4vEgpNwqLw_hBo1Fg0PogIwoWgtQw2tBorKw7ew-Bo1FgkDwmIg6H48UogIo3TouGohPonH4mQw4Jw2UokLoiWgvForK43KgxTgzI40OokLolSo1FgzI46GwxK42D4oFo9Lw5Q4iNgmRoyJo9LwtHgsJwsZ49bgyBgyBwpE4vEo8EgvFo1FwtHoqD42D4wL4pMwuOohPgtpBo3sBg_R4jUw8Mg7O40OgtQonHogIwlaoxbg1W4gY42Dg9Dg9DwpEw4iBgpmBgsJglKokLo9L42DojE4lJwxKorKokLwlBwlBgZgZ4lJ4-J48Uo7Wg_R4qTouGg6H40Og0PonHogI40nB44qBw2Ug1WgsJglKgiO40O4xSg_RwuOo2Mg_R40OwtHo1F40OorKw1Nw_Io-SwqL4i4C4yyB4vd4_QohoBwhXwiegmRw7FoqDwoWw8MglKo1FgvFw3C40OogIwzYwuOozQw_IgiOogIw6Xg7Og3Lw0Gg3LwtHwkTo2Mw_hB45Yw8MglKowUgmRolSwgQwj3CwwuCokkBoghB4jtBohoBgnxB4jtBg3L43KovmBw4iB43KorK4sI4sIwiFwiFo7W4gYgp_BwklC4nwBox0BowUwoWg7OozQguXoxb4-J4pMgtQopV4lJ4pMw2Ug9c4k0BoquC4tP4nXoyiBw-zBo2MwkToiW4shB4xSw-aongBo-rBw9lC48_C4iNolSo_ZwxjBo4BoxCo1FogIowUgkcw7FogIg3L4_QwuO4uWg_R4kbwoWw_hB43Ko6PwtHg-KwgQotY4qT4oew-B49CwieowtBwtHwjMgxTwwcg-Kw5Qo1FgzIwsZ4imBouG4-JoxCg9Dw7e4uvBgoGgsJwvVongBo3T4oewwcwrrB46fwhwBosR4kbwuOopVgnY4-iBgkcw8lBw6Xg2d40OosRovNohPo4awwcooOo6PwhwBgyzBotYoqcowUomZw5Qg8VwrSggZg4Sw-a41uBowmCgpN4jUg9Dw7F46GokLwwD4hG46Go9L42DonH4sIozQgoGgwMwiF43KgyBg9DglKgnY4vE4wLouG44R49C4lJo8EwnPonHotYg-KginB4oFwkTogIwwc4kCwtHgvFgxTw7FowUg_RwnhCw0GwlaogIorjBgzI4jtBgrC47NwiFoyiB42Dw3b42DorjB43Kgx3D49C49boqDoxbwiFoonBw3CwkTwtgBg46GgwM46xCwpEggZ4vEguXgvF4yZgoGo4aw0GwsZghHomZghH4nXg6Ho0XgvFg0PgzIo0XojEglKg2dggrC4uvBgx3DgzIg8VwnP4plB4tPorjBgkD46G4vEoyJg6HwyRgqUwgpB4tPwpd40Oo4agiOgnY4oFgsJoyJg0PgwMgjV4_QojdopVg-jBg2EogI4wLo3Tw3Co8EwnPo_ZgyBoxCoqDo1Fo9L4jUomZwrrBwhpCwh7Dg7nB44jCwznGwn0K4gY4toBw-sCoujE4wLo3T47N4yZ4-JgxTouGgpNw0GwuO4pMoqcw_IwoW4hGwgQg6H41V4lJ4kbghHo7WojEooOgvFgxTgvFopV42c415DouGoxb4rBgvFw_I4imBw-B4sIw-B4sIo4Bg6HgsJ40nB4tPg0hC4zHwtgB4kCw_Iw-BoyJgzIo9kBoxCorKwlB4oF49Cw8Mw4JohoBw_Io2lBgyBw0GoyJ4toBg7Ogp_BwtHgvewmI4oeo5Ig2do8Eg7O4lJ4kbw0GwrSw7Fg7OogIw9T4lJwoW40OgsiBw8lBo92CwpE4-J4vEokLw0Gg0PooOw0foqD4zHg_qBotjDg6rDgg6HgxlCokhF4mpBgq_C4xS44qBw8Mo8dohoBg_8CgljB46xC4-Jo7WouGohPw5Qw1mBooOoghB4mQoonBwqLg9cwwDw_IouG4_Qg_RwsyBgpNg7nBgwMg7nBg0Pww1Box0B478F4zHgrbg9D47NoqDo9LwuOo4zBgiOwlzBgxT4jmCogIojdo4B4hGwuOo4zBw3CglKw-BonH4lJghgBouGwhXw-BonHw4J4-iBgkDg-KgzIo1egnYov4C46f4ixD4kCg6HoqDw8MgyBo1FgwMw9sBwuOgr0BgqUo7oCwlBwpE4zH4kb4kCg6HwwD4pMgsiBgu7Dw0GguXogIg2dwzYov4C4rBwiF46G4gYgsJw4iB4hGwvVonH4yZ4xrB468E4xSwgiCgyaoihDghH4yZg0P4h4BooOgyzB40Oox0B42DovN4oFwkToqDwjM4SgrC46GguXghHo4aojEwuOgpNo7vBwM4rBgyBo1FwlBojEgvFgxTw-BghHw-BghHw_IongB4shB415DgkcwllD4lJ4zgBgkDg3Lw7FopVgvFgxTw-B46GoqDg3LgwMgqtBw7FwvV4kbw6iDgyB4hGgkD4wL4rBo1FoqDgiOgkDo2M49C40Ow3C40Oo8E4vd42D4vdgrCwoW4kCo8d4rB4vdorKgjhK4vEo2pE42D4n7DwlBgwlBgyBolrBwM4pMwlB4shBoGogIofgljBwMwjMgyB4uvBwMg3LgrCg1oCgyBo6oB4So_Z4So-SoG4oF4So3T4rBg1vBwMooO4SoiWoG4zHof42cwM4iN4rB4mpB4oF4rwFgZ42cwMw4JgyBw6wBgZw-agZw3bofoufo4BosqBgZo_ZwMglKof42cwMo2M4SosRoG4-JwM47N4SosRwMwnPofw6X4SguXwMgzIw-Bwq9B4Swie4rBwgpBwM4sI4Sw2UwlBo5hBofg2dwlBw_hBgZosRgZgwlBoGw_I_Y42cnf4gY_YovN_xBo3T39Cw0f_qC41VnqD43jBvlB4wL_8Dw4iB3oFwzxBvlBwqLvlBwqLngIo_rCvMgoGvMojEnGw-Bn4B42cvMw1N3S4uWoGg5ZwM48UwlBoiWwlBohP4rBosRoqDw0foGgyBwiFgnxBwlBokLgvFw-zB4vEolrBgiOgpqEg8V4swG4zHoioCgkDoqcwlBorK49C42couGwj-B47NoglEwmIg9uColSoprFofglKoxC45Yg2Eg4rBoxComZgZonH4vEg7nBw3CggZ4vEomyBojEw8lBo1F4rzBwlBokL4rBooOwlBwjMw-BwrSgZghHoxC41Vw0G4i_BoqDgof4kC4oewMo1FoGgkD4rBowUoxCwgpBofwnP4SoyJw-BwtgBoGg2Eo4BwlawwDgz6B4kCg2dgyBoqcofg3LogI42gE4kCoghBgZg0PwM4tPA46GnG4sIvlBo7W_qCoiWn4Bo9L3vEw7en4B43K_xBw_I3S42DvlBonH32DggZvlBwtHnfghHv-Bw4J36GoivBv3Cw9Tnf4pMvM4xSgZ4pM4S4hGo4BwjMoxCw8Mg2E4mQw3CwtHg9D4lJg9Dg6HwpEwtH42DgvFg9DwiFg9D4vEo1Fo1FonHo1F4oFoqD4oFw3Cw-BgZgkDwlBghHo4Bw3CwMwtHoGw4JvMwtHvMw4J3S4hGA4sI4SouGwlBwxKgrCw7FgyBg-Ko8Eg2E4kCgqUgsJwnPw0GwrSogIg2Ew-BwtH42Dg9Dw-Bo1Fw3C4wLg2EowU4lJg5yBg1W4lJwpEgrCof4vE4kCo8Ew-BoxCwlBouGw3Cw1N4oFglKojEwiFo4BgqUgoG4zgBgzIwlaw7Fo1FgyBo6zDgkc4pMoxC4_Q4vEwoWgvForjB4sIo2MgkD4sI4kCg6Hw-Bo3To8EgtQg2Eg2EgyBg0Po1F4pMwiFgnYwqLouGw3Cwwcg7OoufwnPgwMouGooO46GwjMg2EorKgkDo1FofgvFofw4JgZg6HA4sIvMwtHnf4zHn4BgmRn1Fw_InqDg4rB3tPokkB_oNw7iE31uBwjMvwD4wL39C4lJ_xB4ranqD4pMnfgwM3rB44R_xBotY_qC4xS3rB45YnxCgwMn4BorK_xBw1N_jDoqc_5HwuOvpEoyiBv4J421B_zPorKnqDwqL_jDginBnkLo0X36GghHn4B46Gv-BozpB_9K4zH3kCwmIv-Bw8M39C4sIn4Bw7e36Go9L_qCwtgB36Gg3Lv3Co8Enf4jU3vEg8uB_kKwiFnf4oFnf4SAorKn4BwjMv-Bw_I_YwmIAw7FAgyBoGojEAgrCoGwlBoGwlBoG4pMoxCouG4kCgzI42DgzIojEo5Io8EwtHg2Ew7FojEwmI46GgiOwqL4-iBg9cg_qBg-jBw-BgyB4kCo4BojEwwD4zHghHg2Eg9Do2MwxKo6Pw8MgzIonHozQ47N43K4sIo5IghHwmhBwwcg2Eg9Dg6Hw0GgmqBorjBw9TozQwnPo2Mw7FwpEwtHw7Fw3Co4B43KghHw7FoqDo1FoxC4oFgrCg2Eo4B4oFw-B4vEwlBovN4rBo1FoG40OAw0G_YgsJ_xBw0G_xBghH3kCo5InqDwiF_qCw3CvlBg6HnjEw1NngI4-J3hG4sI3oFo9L3zH48UvuO4_Qn9LggZn-SwxKv_Io3TnsR49bntYgxT_-RgrC3kCwiFn8Ew4J3lJozQvnPw7Fv7FonHv0GgzI_5H4xSnzQwxK_rJ4nXv2UwmI_gHolSn6Pg1Wn3TgZ3SwuO3pM4vEnqD43K36G4zHnqDghH_qC4vE_Yw0G3Sg9DAgoG4S4vEofoyJg9DgwMo1FwtH42DwiFoqDw3Co4Bw7Fg9DgiO4lJojEg9D46Gw0Gw_IgzI42DwwD44qBwunB49CoxCojEwwDwlBofghH4hGoxCgrCw4J4lJ4kC4kCgkD49C4sIogI4zHgoG4zHouGg3L4sIg6Hg2E4zHw7F4hGo8Eo8Eg9Dg2Eg9DwiFojEoxC4kCo8EojEg-K4sI4hGwpEo4Bofo1F49CouGnqD4kC_qCw-Bv3C4sInwUgvFv8MofnxC4lJniWgoG3_QwMvlB42DnvNwwD30Oo8E3nXoxC_vMgyBnuG49Cv1Ng2E3qTo4B_gHwwD33Kw-B36GorK_jc49CngIojEvqL4vE3pMgoGv5Qw3CnnHw3C_5Hof_qCwlBnqDgZ3kCvM39C4SnjEofv3CgyBnxCoqD3vEoqD32DooO3wLojE32Dg2En1FgkDviFw3Cn1FgyBnjEg6HvpdgZ32DgZ3hGvMnkL3rBv5Q3SvqLgZnpV4S3pMoGvgQnG_wTwM3vEoxC4So4BAwwDoGgkDo4B4kC4S4_QwpE4oFgZgvFnGwwDvMgrC_YwwDnfojE_xBg3L_1EwtH_jDofghH4rB4sIgyBo2MgZ4oFofgsJwMg2EwM4vEoGwlBoGgkDoxCowUwlBokLgZ4pMoGorKof4qToGgrCoGg9D39CgyBnxC39CvlBv-BvpEvxK3rBviF_Y_uFnB3hB",
          transport: {
            mode: "busRapid",
            name: "FlixBus N44",
            category: "Coach Service",
            color: "#73D700",
            textColor: "#FFFFFF",
            headsign: "Berlin Alexanderplatz",
            shortName: "FlixBus N44",
            longName: "Berlin - Hamburg - Amsterdam",
          },
          agency: {
            id: "65528_ba99721",
            name: "FlixBus",
            website: "https://global.flixbus.com",
          },
          attributions: [
            {
              id: "d2a3dda55cb717c0cc9a9d085a4e6870",
              href: "https://flixbus.com",
              text: "Information for public transit provided by FlixMobility GmbH",
              type: "disclaimer",
            },
          ],
        },
        {
          id: "R2-S4",
          type: "transit",
          departure: {
            time: "2025-10-01T02:55:00+02:00",
            place: {
              name: "Hamburg central bus station",
              type: "station",
              location: {
                lat: 53.551767,
                lng: 10.011657,
              },
              id: "65528_716",
              code: "HH",
            },
          },
          arrival: {
            time: "2025-10-01T07:50:00+02:00",
            place: {
              name: "Aarhus C FlixBus stop",
              type: "station",
              location: {
                lat: 56.152223,
                lng: 10.208635,
              },
              id: "65528_1080",
              code: "AAH",
            },
          },
          polyline:
            "BH4mrt9for0--F_E_mEoG_1E4rBvtHgkD3-JgyBvwDw-BnqDgyB_Y49CgZ_YvtH_xBnvNgvFn4Bw3C_Y4oF_xBw8M32Dg-KnqDghHv-BonHv-BwwD3rBvMvwD3kCv9T3rBn5IoyJnxC4oF3kCw7F32DgkD32Do4BvlBgrCv-B4rB_qCgiO32co4BnxCoxC_xBgrC_8DnGnqDAnkLvMnzQvMn9L_YngIvMnkLwMvqLofnuG4rBngIw-B3zHof_8D49CnkL49CvxKwwD3iN49C_9K42D30Ow3C_kKgkDnkLo4Bv0GwlB_uFg9D3nXoqD_gHgrC3vEg9D3hGwwDvpEw-B3kC4hG32DgsJ3hGgkDvlB42D_qCwlBvlBwpE3hG42Dn1FgyBnxCgkD_nGw3C_uFo4BnjEoGn4Bw3Cn8EgrC3vEoqDnuGwpE_yIwiF_kKglK_wTojEvmIw3C_qCo4Bv3C4kC3oFgyB_1EgZn8EoGn8E4rBvxKof3lJgZnvNA3vEAngIAnjdA3-JwM_2LwMngI4SnkLwMv7FofvrS4S_1EgZnxCgZv3CwwD_5HojEn5IwM_Yo4B_8DwtH_zP4uW_0vBw0GnoOgvF_2LgkDnuG4oFnkLo4BvwDoxCnuGojE3lJgrCviFgvF3pMw-B_1Eg2EnrKwpEv4JoqD_yIw-Bn1FwlB32Dw-B_nGwlB3sI4S_nGgZnyJo4B3zHwMvwDwMv-B4S3oFofvxKnGvmIvlBnhP_qC_zPvlB_5HgZ_hO4SvwDgyB3zHojEvyRo4Bv0GoqD_vMgZ_jDgZnqDwlBn1FoxC_uFw-B_5H4Sn8Ew-Bv0GgyBvtHgrC_rJo8EvnPw-B3oFgyBnuGo4B3oF4rBnqD49CvmIwlBnxCgrCn8EoqDnuGoqDv0GwuO_qbw-BvwDw3CviF42DvtH49Cv7Fo4B_nG4S3hGAnqD3SnrK_Y_9K_Y3sInGv3C_qC_2Ln4B_gHv3C_9KvMn5I_Y_8DvMnxC3rBn1F3SvwD_Y32D3SnyJAvpEoGnyJofvmIofnqD42Dn5Io8E_rJoyJn5I46G3hGw3C3kCgrC3kCo5IvmIojE_8DwmIvtHg2E3vEgkD39CouGviFghH_uFo8E_1Ew7F_1E49C_qCofnf42D39C4lJ3zH4zHnuG4vE32D4vE32Dw-Bn4B4S3Sof3S4sI3zHw_In5Iw8MnyJgvFv3CghHnxCgkDnfghHv-BglK39Cw3C_Y4oFn4BwtH_qCgkD_Yo8E3SgoG_xBw3CnfojE_xBgzI39CoyJvwDo8EnxCg0PngIo2MnuG4zHnjEglKviFgoG39Cg9Dn4Bw4J_1EwuOnuGw1N_nG4vEn4BgvF_xBw-B_YwwD_xBgrCvM4rB3Sg9DnxCwpE32DwiF3hGw7Fv_Ig2E3zHojE36Gw3CvpEwwDn1F46G3-JwqL_lRwpEngIgZ3rBglKnlS42D3vE46G3lJwpEn8Ew-B_xBwwD3kCwwD_xBw-B3S4zHn4B47NnqD4-JvwDgsJvlBooO_jDg2EvlBgjVv0Gw1N3oFgtQnnH4lJ3vEovN3zHglK3hGovNn5Io4BvlBg6H_uFohPvxKw5Q33K4sIviF43Kv7FwjM_nG4zHvwDwjM_uFwvV3-JouGnqD40O_yIooO_kK4lJvmIw_InnHouG3oFo9LnyJohP3pM4jUvgQouG_1EwtH_1EojE3kC42D_xB42D3rBojEvlBwwD_Y46Gnf46GnGouG4SonHo4BwtHoxCghHoqDwwDw-BogIgvFw3CgrC49Cw3CwgQwgQo1FgoGo6PwkTwiFgoGouGo5IgvFonHoyJo9LgpN4tPgzIo5IwtHwtHw4J4lJohPgwM4lJghHwmI4oFo5IgvFwnPgzIgrC4rBouG49CouG49Cw4J42DoyJwwDwmIgrCozQo8Eg1W46Gg2EgyB4zHw3Cg2EgyBg7OwiF42DwlBo4B4SojEo4B4lJwwD4iNgvFw7Fw3ColSoyJonHwpEwmI4oFwpE49CwtHg2E4hGojEoyJghHo2M4-JwmIouGonHgvFoqDoxCglKonH40O4-J4iNo5IokLghHg9D4kCwqL4oF4-Jg9DgzI49CwjMg9Dw3C4SgrC4SglKgrCw7Fofo5IwlBghH4S4oFwM47NwM4xS3SotY4SgnYw-BorKo4BorKo4Bo9LgrCotY4oFwyRo8E4qTouGonHoxCovN4oFwjM4oFg3kBwyRo5Ig2E4iN4zH4lJo1FomZwgQg6gB4uWgoGg2EolSw8Mg8V4tPolSw8Mo8dowU42DoxCogI4oFw8Mg6HgoG42DwiFgkDw_I4oFo5Io8EoxC4rBonHojE43Ko1FgrCwlB44Ro5IoiW4-Jo1ew8MwyRw0G4xrB47N44Ro8E48Uo8Ew5QwwDgqtBg6HgtQw-Bg6HgZ4plBo4B4_QAomZnf4mQvlBwoW_qCwxK3rB4uW32DgtQnqDwyRnjE45YnuGwqL32DwoWvmIo2MvpEghHv3CowU3zHwvVv_I4pMn8E49bnkL4iN_uF4vd_2Lg8VvmI4-J_8D42cv4JgjV_nG4mQvpEwtHn4BojEnfgtQvwD48UvwDw4J_xB4uWnxC48U3rBw3CA4uW_YgjVwM4pMgZwmI4SgmRo4B4lJofwiFgZwmI4rBghHofonHwlBw_Io4BgwMoqD4jUo8Eo2MwwDotY4zHwyR4hG4yZw4JgoGgrCginB4_Qo3T4lJwxKwiFonHwwDw7eohP4uWg-K4iNouG4vd40O47Nw0GwhXg-K4xSwmIghHgkDw0Gw3Cg0PouG4kb43KwpEgyB49CwlB4_Qw7FgzI49C4wLwwDg6HgrCo-So8EgiOwwDwxKoxCo5IgyB43Ko4BgpNgrCgpNgyBg3LgyBw5QgyBwvVwlBwyRwMwgQvMwoW3S4tPvlBgvF3SgoG3Sw3CvMgvF3SgqUv3C4oFnfw9TvwDwkTvpE44R3vEwjMnqDwtH3kCgpN32DopVnnHotYn5Ig0oBvgQwoW_rJ4oenvNokLn8EwzY_9KwqLn8E41VvxKgxTn5Iw0G_jDo9Lv7FosqBv9T48UvxK4_QngIw0fvgQopV3-Jw4Jn1Fo-SnyJwi3B32cw1Nv0GgljBvkTwlav1N4zHnjEwkT33K4oe3_Qo0X3iNwxKv7FokL_nGg6gB_3SwrS_kKgvF_jDwrS3-Jw_I_1Eo3TvxKg3L3hGovNvtHo4Bnf4lJ3oFgxT_rJojEv-B4hG39CgsJ_1E4vEv-B47Nv0G4mQvtH4xS3sI46f3iNwlav4J44R3hGo9LnjE4uW36Gg3LnqDg_R3vEgqU3vEwrSvwD46GvlB49C3SgsJ3rBwyR_qCoyJ_Yw5QvlBw4JvM43KvMgjVoG4kbofg9DoGwiFwM4-JwlBo1F4Sw0GgZo0Xg9DwtH4rBwyRwwDomZouGg3LoqD40Og2EwqLojEg4SonH46GoxCwrSg6H4iN4hGwvVg-KwwDo4BglK4oF4mQoyJw4JgvFwyR4wLgvFwwD4mQwqLw6XwyRgzI46Gg7Og3LwxK4sIg3LgsJo7W4qT4_Qg7O4_QooOgtQwuO40Ow8MgoG4oFg9DoqD4sIghH4nXgxT4lJ4zHokLw_Ig-KgzI4sIw0GotYg4SgtQwjMw3bo3To7W4tP46GwpEw3bwgQgrbwuOwjMw7FgtQwtHwuOgoG4hGgrC4lJoqDomZ4sIwzY4zHwsZ4hGggZo8EwnPgrCo6Pw-Bg_Ro4B47NgZolS4S4xSAooOvM4mQvlBg1W_qCg7Ov-B45YvpEw-a_nGgpNvwD4iN_8D4k0Bn-S4uWv_Ig-Kn8Eoxb_2Lo0X_9Ko9Ln1FooO36Gg8VvxK4qT3lJ40OnnHwjMn1FgtQ_5Hgvev1NgjVv_Ig4SngI4pMn8EgsJ32DosR3hGgsJ39CgtQ3oF44Rn8Ew_I3kC4-J3kC4pMv3CogIv-BokLn4BwiF_Yo1F_Yo7WnxColS3rB49CnGoiWvlBgsJnGgoGAwgQ4SonHAglKgZo4aoxCwxjBgvF4xSwwDgrb4hG4gYw7Fo-S4oFwlag6Hw1NwpEg9coyJgwlBovN4oeo9LokLo8E4qTogIw-aokLwmIwwDor8Bwla4zHgkDowtBw9TwkTogIw4JwpE4_QwtH4v2B41VgoG4kCg9DgyBoxCofo5hBo2MwoW4zHg1WwtHwvVouGwvVw7Fo-So8EghgBghHw7FwlBwnoB46G4kbwwD4plB42D4sI4Sg8VofggZ4SwxKoGwkTvM4ranf4mQ_YwwcnxC4mQv-Bg6gB_1E41V32DwnP39C4vE_YosR_8D4xS3vE4pM39CwpdvmI4pM32DgmRn1FwkTv0GgzhBn2Mg4S3zHwmI32DovN3hGw9Tn5I4jUnyJo9L3hGg4S3-JohP3zH4v2Bn8dw5Q_rJgpN_gHgsJ3oF4o3B3oeoyiB3xS4mQn5IoghBnzQg4S_rJ40O36G4vE3kCo4a_vMwjM3oF4wLn8Ew4JvpEwpEn4BwzYv4JwnPviF42D3rBgoG3kC4vE_xBg9D3rBw0G_qCwrS3hGgvFn4B4oF_xBgkDnfo1F_xBo5InxC49b_5HorK3kC4oe3hG4jUvwDolS_qCg7On4B4mQ_xBo2Mnfo-SnfwmInGg-KnGomZAgkcgZopVgZosRwlBwlaw-BglKwMoiW4kCoufw3CgyagyBg2do4BoufgZomZAw4JvMoghBn4B4sI3Sg3LvlB4-JnfgnYnqDo0X32D4-Jv-Bwie3hGotY3hGo-S_uFw7Fn4BwpE3rBo4B3SwkT3hGg4Sv0GoqDvlB4_Q3hGouG_qC42D3rB4zH39C4rB3SgwMviFgtQ36G4hGv3C4yZ3wLgpNn1FouGv3C4rB3SojEv-BgrCvlBwugC3vd4oF3kCwwD_xBgmRnnHgmRnnHwkTnnH4liB3pMosRviFwgQ_1EoqDvlB47N_jDgtQ_8D4xS_jDokL_xB4oF_YorKnfosR3rB4wL3S4hGnGogIAo2MoGg8VgZ4vEwMo2MwMgsJofo9LwlBwmIwlBwpEwMw4JwlBwpEgZ4-JgyBw4J4rBw_I4rBosRgkDo4BoG4jU42Dw1Nw3Cg5ZgoGw9TwiFo2M42D4jUw7Fo5Iw3CgtpBwuO4oFw-BggZw4Jw5Q46GoonB44R4gYg3Lo2Mw0GgtQ4sIw8MghHwqLgoGojEoxCgtQw_I4oeolS4lJgvFwwcg_Rw8MgzIooOgsJo5hB4nXw9sBghgBowUg7OgtQ4pMgpmBojd4jtBgsiBo2M4-JwwDw3CgljBgrb4yyBg7nB4sIouGgpNglKw_IonHgtQo2MgjV4mQwwDw3C46G4oFgvFwpEwpEoqDoxC4kCgqUwnPwnoB4vdorK4zHo5IouGohPg-KwmIo1FghHo8Eg2EoqDw7FojEglKghHghHg2E4pMwmIouGwpE45YozQo8EgkDgwMg6HoyJw7Fw0GwpEo_ZwnPgtQoyJgvF49Cg5ZooOgrbooO41V43K48UoyJgkcwjM4toB4tP47N4oF4oeorK4sIoxC40OwpE4wLoqDw7ewmIwlaouGw9TojEwpdgvFwkTgkDoxCoG4_Qo4BghHofw1N4rBg4S4rBg9DwMg6H4SgzhB4rB4yZvMwvVnf49b3kCgvF3SotYnqDwsZn8Ew6X3oF4nXv0G4uW_gH46GnxC48U3zHojEn4Bo1F_qCwwD3rB4zHvwDo9L_uFwtHvwDw_I_1Eo2MnuG4mQvxKgsJ_jDwlan9Lw0Gv3C4sI32DgpN3oFolSnuGw8M32D4pMnqDo7W3vE4pMv-Bg7O3rB4yZ_YwoWofg5ZwwDgiOoxCgkcwtHg1WwtHo-S4zH4iN4hG41VwxKwrSglKw5QorK44Rg3Lo2Mw_Iw6XwrSgjVosRopV4xSgqUgxTohP4tPwxKokLgxT41V40OosR40Og_RwnP4qT40Oo3TongBg8uBg-Ko6PwqLw5Q4oFgzIgtpBolkC4xSw0f43KwkTgkcwsyBgjuBo5zCongBw_6BgqUg3kBosRw7eosRo8dw2Uw4iB48UoyiBgpN48Uo2Mo3Tg6Ho9Lo6P4nX42DwiFg5Zg-jBw-Bw3CwgQw9T43K47N4vEo1FwmI4-J4sIoyJgwMooOg3Lw8MozQgmRo5I4sIo-S4_Qg-Kw4J4qTwgQguX44Rw5Q4wLw_Iw7FwrSwqL45Yw1Ng-KgvFosRogIoiW4lJ4zH49CohPgvFou4Bo3T4mQ4hGo8Eo4BwgQgoGokLwiFonHwwD46GwwDooOghHohPogI4iN4zHozQorKgiOoyJ47Nw4JgnY4xSorKo5IgtQooOozQ4tP4pM4pMw4JorKgzI4lJ4liB47mBwieo9kBw3bgzhBw6Xw3bwjMovN4-JwxK4qTgxT41VgqUoiWo-Sg1W44RwrS4iN4zgBgjVo2lBowUo-So5I4qTg6H40OgvFgya4sIwyR4vEwuOgkDwkTwwDo0X49CozQofo4BoGo-SgZwrSnG42c3rBo3T_xBo0X_xBwnP3SwmhBnfgjVgZ4iNofozQo4B44Rw3Cw1NoxC4uW4oF4oFgyBgsJw3Cw4Jw3CowUghH4hGoxCosRonH4uWorKwoWokLgpNonH4-Jw7FwxK4hGw8M4sIozQwqL42DoxC47NgsJwiF42Do1FojEg-jBoqcw7F4oFosRg0PwqLwqLgiO40Og9D4vEouGwtHwwD4vE4oFouGorKg7OorKw5QgkDo8E46G4iNg6Hw5Q4zH4qTo1FwgQ46GwzYwpEgqUgrCo2MgkD4jU4rBg3LofgwMofw8Mo4Bg1W4rBw5Qw-Bg1WgyBovNofgsJgvFwqkBwwDgmRwtHghgBwtH4rao4BgoGwjMwxjBoqDgsJ4sIg1W47NohoBw3Cw_I4rBojEwiFolS4kCg6H49C4pMoxCgpNw3C4_QgZgoGwMg9D4rBg3Lw-BotY4So9LwlBwzYAouGnG4-JvMw3bnGwxKvlBwqkBnfwvuBvM4zgBoGo-SAw-BoGg2EoG4sIgZg7OgZovNgZwqLgZohPAg6HnG46Gnfg3LvMgsJoGglKwM4hGgZg6HgZghHgZg9D4rBw7F4rBwiF4sIgyaofoxCwwDwxKw-B4oFgrCouGgrCghHg3Lg2dw0G44RojEg-Ko8E4iNo8EgwMwlBoqDg9DgsJofw-B4lJw9T4rB49Cw_IgxTw-BwpEw3C4lJwpEwgQof42DoxC4iNgyB4-JofwpE4S4kCoxC4lJwiFgiOo8EgzIwwDgvFnuGomZv3CokL_qC4lJAwpEnqDg3L_YwwD3rBw0GvlB4oFnxCorK3rBwwD_xBw3CvwDo8E_8D4vE_8Dg9D32Dw-B_YgZviF4oFn4Bw3C39C4hGv3ConH3SgyB_Yo4B_qC46G3rBwwDnxC4zH_YoxCn4BgvFnxC3kC32DnqD_vM_kK3yFzsEnrFrmEnuG3oF_qCv-B4vEvyR4S3kCnf_Yn1FnjEv4JnnHn4BvlB_yI_nGgkD_oNojEv5Qw3C3wLgZnqDg2E_-RgkD3wLgkD3hGw8M_iVw3C3vEwiF3sI42DnuGojE36Gg9DnxC42DnxC4pM_gH4iNvmI4vEnxCo8E_jDgyBnfgkD3SoqDnfw3C3rBvlB_8D_8DnoOvwDnkLv-B3vEnjE3lJn8E_9K3rBnxCv7FvjM_8DngI_Y_xBn8En9L3oF3iN39CngI3hG3mQv7FvgQ_vM3hf_xBviF3rBnjE_8D_2LvwD_2L36Gn7W3rBviFv-B_rJn4B_rJnf_gH3S3wLAvpEgZ_mYwMvtHnG3-J3S_rJ3rBv2UvlB_qbnG3lJA_YnGvvVoG_1do4Bv8-B4S3jUoGnyJwMvlaAnyJnGv8M_Y3qTvMvqL3S_gHvM36G_xBvuO3S_nGn4Bv8M39CvyRnqD3mQvlB3vEnqD_oN_1E3_QvpE37NnjEvjMviF30O36Gn-SvxKnjd_1E_oN3zHvhXviF3_QnjEn6PvpEnlSvpE31Vnf_uFn8EnngBv3CvhX_xBnlSnxC_5gBvM_nG3SvmI_Y_rJvlBnrK_YnuGvlBn5InxCn1e3kCvnPnxC_6On4BngI3vE3_Q_jD_kK_xBn1Fv3CvmI3zH3nX_yI__Y_nG38U3vE_lR_jD37NnqD3_Qv-B3iNvlBn5In4B_wT_Y3lJ3kCnonBn4B_vlBnfvoW_YnpVvMnkLvM3zHvM_5Hn4B3xrBnfvzY3rB3-iBv-Bv73B3kC_u3BnGnkLA3hf4S_9jBgZ3iNo4BvoWgrC_0W49CniW42Dn7WojE_7VwwDnzQ4hG35YgoGn7WwmI_qbwpE_oNwtH31V4wLv0f4qT3gxBw6X_g5BolS3qsBoyJ3gYwuOv8lB4sIn0XonH31V4-J3hfw8M_wsBwxKvunBw7Fn0X4lJn6oB46G3shBo8EnmZ4oF36fgkD3qTwiFnyiBgrCnsRojEv4iBg2E3xrB4oF_98Bw-Bnxb4kC_9jBoxCnu4B4rB33jBwM38UwMvnPwM3xS4S390BnG_xzBnG_1d_Y3vdnGnhP_Yn3Tn4BnmyBvMvtH_qCn3sB_xBn8d_xBv7evwDny7B39C3o3Bn4BvqkB39C_12B_1E3p-Bn4Bn-S3vEv1mBnjE_1dviF36f3oF39bviFvsZnjE_3Sv3CvqLv0Gnqcn1F3kbnjEn-S3lJvgpB_qCnkLvtH_kjBnxCv1N_jD3qT32Dn4a3kC_6O3rBnrKn4BvnPvlBvxK_qC35Y_qC3hfv-Bv_hBn4B_xzBvwDvl-D3SvjlBAnpuBoG3iN4kC_r7BgkD3gxBw3CvjlBwwD31uBgrC3zgB4lJv50DgrC39b42DnzpBw-B_-R4rBvjM4oF3imB4rB_yIoqD38Uo5In4zB42D31V4sI3nwB49CvrSgvFv5pB49CnmZwlB3pM4kC35Y4rB3ra4rB3toBoGvzYnGvgQnGvnPvlB3hfnG3sI_Y_hO_qC35xBnf_iVvlBv6XvqLnrrHnuGvqoEviFvy8C3vE3l7BnjEv5pBnuGvi3B_rJ30gCviFnuf_5H_iuB32c30kF3hGv_hBvie3ntFviFvpd3vEnmZnrK_55BvjM_zhC_9Knu4B_gH_9jB30O3qlC39Cn2M_Y_jDv7FnmZ3rBnuGvM3vEnxC37NvwDnlSvwDnxbnfnhPoG30O4rB_hOwlBvtH4rB36GoqDn2M4kCv0G4oF3iN49Cn1FwtH_9KgsJvqLgoG3hG4-J3lJwiF_nGo4B_xB46Gn1FojEvwDghH_nG4vE_8DwwD39CogIv0Gg2dnxbo8EvpEgwMvjMwwc_qb4hf_nforKvxKwrS3qTgwM_oNw5Q34RohPv5Q4oev_hB4mQ3xS46GvmIg2En1Fo3T3nXgrC39Cg2E3hGg7nB__xBoxCnqDw-B_qConHnyJ4zH_kKwjlB__xBoghBnpuB40nB_55BoghB3yyBg0P35Y45YvnoBg0Pn_Z4hGnrKgkD_uFg7O_4ZgvFv_IgyBnxC49CviF46Gn9Lw7F_kKw9TvxjBokL3jU4vEngIw7F_9K4vE3sIgsJnsRwmI3tPgkDn1FovNvzYo-SnrjB4xS_kjBghH3iNgkD3hG4_Q36fg9DvtHwiF_rJo8Ev_IgrC3vEw8M3gY48U37mBo-rBviwC4nX3mpBojd__xB42D_nG45Y3mpBo9Ln-Sw0GvxKg0P35YwmIv8MwgQv6Xg4S39bwtHvxKgqUvwcg3LnhPw3b3wkBouf_omBwkTnpVonH_5H4zH3sIgnYvsZgxTvkTwyR_sQwvV_3Sg7O3pMolSnoO4ra3qTg2d_pUgnY_zPwmhBnwUwunBn0X4ra3tPgsJv7F44RnkL4xS33Kw2Uv8MwgQ_9K44R3wLoxb_wT49b_iVw9T3mQ4pMvxKgoGn1Fo2MvqLozQ3mQg6H3zHwvV3nX4mQvrSwjMvnPgmRvvVgvFnnHgpN3xSorK30Oo1Fn5Io8EnnH4nX33jBwpE36GwpE36GgsJn6P47NvzYw1N__YogIvuOwwDv0Gg_R3liB4ran4zBg75C_u0Fojd_n4Bwiev73Bw8MvhXojd3nwBw7evovBgmRv6Xw2Un4ag7OnlSw1N_zPw5QnlSw9T_pUwoWv2UgxTnzQwgQv8MgwMv4JgqUnoO4iN3sIwiFvwD49Cn4BwpEv3C4xrB_xawtH3vEoqnDvq9B4vvC3uvBwtH3vE4uWnvN47_Bv1mB4uW37NwtH_1EovmB_4ZwjMv_IgqU_zPg0P_vMo7Wn3T4ra3gY4vdvpdwla_jc4jUn7W4xSvoWwjMvnPo-SvzY4wLn6P4gY_riBw2U_nfg3L3xSwnPvsZg8Vv8lB4xS_riB43K38Ugyanj2BgmR_vlBo6Pv4iBwsZvm6BokL35Yg8V_0vB4oF3wL47NvieonH30OwuO_1d4pM35YgkDn1Fw_InzQgvFnyJ4sInhP4hG_kKgvFnyJw_I30Og9D_nGgtQ_4Z4-JvnP43Kn6PolS3yZgoG3sIo5IvjMouG_5Hw7FnnHgkD_8Dw3C32DgyBv-B4vd_kjBw3b_nfg_qBvovBwien5hB4hfnkkBwqL37NooO3xSogI33K46f_wsBg_qBvnhC4-iB3v2Bg0oB_29B4ra3plB4wLvnPg_R3uWgoGngI46fvjlB4lJnrKo1F_nGwrSvkTgzI3sIw0fn8dw2UnsR42D39Cw_IvtH4mQn2Mgkc38UozpB_1dg0P33KoghBv6XoyJv0G43KngIg3L3lJwuOnkL4lJ3zH4tP_oNo3TvyRw0GnuGwtHnnHw_I_rJo1Fv7Fo0X3yZg7OvyR46GvmIwjMn6Pw0xCvipDo8dnrjB4iN30Ow1NnoOo9LvjMguX31V4tPnvNg8VvyRwoW3mQgmR_2LwxK36GwtH3vEw6X3iNwyRv_IgpN3hG40O_nG49b3-JwuO_1Ew8MvwD4pM39Cg6H_xBowU_8Dw8Mn4BoiW3kCo6P_YgwlBAwnPofgjVo4BgjVoxCgya42D4xrBonH421BoyJwqkB4hG4liBg2Ew6XgrCg4SwlBw2U4S4iNAwzYnfwnPvlBwla_jDglK_xBg3L3kCgtQnqDorK_qCwxKv3Co6P3vEwkT3hGo0X3sIg_RnnHw2U_rJgpNnuGolSnyJgjV3wLowU3pMwzYn6PgtQnkLw5Qn9Lw6XnsRgzhB_4ZgzhBv-ao-rB3wkB4imBnngBoy0CnwmCosR37N4wkBvwcomZ3xSwsZvyRoqc_3Soqc3_Qg0Pn5I48U_9Ko6P3zHo-S3sIozQ36G44R_nGwiF_xB4hGv-BgwMvwDgrb3zHonHn4BouG3rBwpEnf4tPvwD44qB3lJgsiBnnHwxjBvtHolkCvuOo9LnxCogI_xBgqUvpEwvV3vEg2E_Y4gjD_iVwiFvlBw5QvwDw7FvlBgiOv3C4jmC3tP4hfnnH4qsB33Kg22BvuOozQ_1Eo_yB3tPgzI_jDo1Fn4Bw5Q_uFwmhBn9Lw4iBv1N47Nn1Foxbn9Lg7Ov0GghHnqDo0X3wLo9L_nGw3C_xBw3b_hOw4J_uFgvenlSowU3wLg0Pv4JwpdvkTwvV_6OgzI3hG4mQ3wLg-K_yIw8M3-JozQ3pMowUn6P4jUnzQgiOnkL490B_wsBwllDvj3Cw4iB3vdo3sB_2kBgljBv3b4nX34RgiOvxKwgQ3wL4mQnkL4jUv1Nw5QvxK48U_vMongBvrSw-a_oN4ra3pM4lJ_8Dg4S_gHw5Qv7FowUnuGw_InxCgqUviFwvV_1Ew5Q_jD4nXnjE4uWvwDwoW_jDwm6BnyJgve36GgtQnjEg-K_jDo1Fn4B4mQn1F4mQ3hGg0Pv0GorKn8EosR_yIo-S_kK40On5IorKnuG40Ov4J4lJnuGgiO_kKg5Z3jUwtHv7FohPn2Mw4JvmIw5QvuOojE3kC4vEv-Bw3CnfwiFnfg9DoG49CgZgkDgyBw7FwwDoqDw3C42Dw-Bw3CgZw3CwMoxCnGw3Cnf42D_qCgvFnGo4BwM4rB4SgrCgrCwlBo4BoxC4oFojE40O4tP4v2Bw_Io1ewuO41uBwjMgwlBw8MgwlB4iNwjlBglKgrbgZw-BgmR4xrBo4a47_B4mQ4-iBgya490Bo9L4uWgvFw4JogI40OouGokLgiOo0Xw7Fw_Io5Iw1NwgQguXwgQwoWo5I4wLg6Hw4JgjVotYw8MgpN4iN4pMgpNokLwmIgoGw4JouG4iNghHgtQwtH43KwwDg7OwwDonHwlBwtHwMglKwMovNvlBgwMnxCgvF3rBglK_jDgmR_gHoqDn4B46G_8DgpN3sIwlBnfg2EvwDwqLnyJ40OnoOwjM3pMo5I3lJo8E3oFw_I_rJ4uW_mYw0GvtH4oF_1Eo4BvlB4kCnf46G3kCo4BnG4vEoGgvFofg2EoqD49Cof49C4SgkDAgrC3SoqDn4Bw3C3kCw3C32DgyBv3CgyB_8DwlB_1EoxCnkLw_Io8EojEo4B4zHojEghHojEw3Cw-B4-JghH4lJgoGg9Dw3CghHg2EoqDgrCw-B4rBw0G4vEojEw3Cw7Fg9D40OwxKgZ49CgrCoxCoxCoqDwlBw-Bg9DwpEwjMgmRg9Dw0GofwlBw-B4S4SgZ4kCgkDw3CwpEg9Dw7FgZwlBw3CwpEg9Dw7FwwD4oFw-BojEwlBg9D49Co2MoxCwxK4kCogI4rBogIgyBo5IoxCw4JgyBojEojEgzIoxCojEouG4-Jw-BojEofg9D4kCohPgrCo-SAwpE3rBgkDn4B4kCvpEw-Bv3CgrCv-BgrC3rBwwD3rBg3L3Sw4J_1E_xB_qC_Yv0G39Cv3C3S_xBAv3C_uFnlS3iN_nGvwD_yI_1EviFAr0CorKjnDo2M42cwkToqDofwMnqDgZ3kCwlBv-BwiFn8EgrCn4Bo8E_qCgyBAw3C4Sw0G49CgrCgZg2EgyBwtHgZgvFvlB4kC_Y46Gn8EgrC_xB42Dn4BgkDnfgkD_xB49CnxC4rBvlBw3C_qCgrC_Y49Cv3CgZvlBwMv-B4rB_xB3rBvpEnGv-B3rBviFnqD_6O_qCvqLnf3oFn4BvqLnGnxCnG_qCvM3hGAvqL_YnnHnfnnHn4BvmI3rB_nGn4Bv_Iv3C3-JnxCv0G3kCv7FnjE3wL_uFv5Q_xB3oF3kC_5Hv3Cv4J3hGvoWnjE_zP3rBn8E3kC_yI_YnqDv3CvxK_qCv4J3kCnyJvlB_gHn4BnyJnfnnHv-Bn6P3rB_6O_Y_zPnGvxKoG3mQofv6XoGnuGoG3zHwMngIoG_nGoGnhPn8EoG3kCnGnxCnGnqDvM_gHn4Bv7Fv3CnjEnqDv0G_nGnxCn1FvlB32D3S32DnG_gH4S_8DwlBnjEg2Ev0GovNn-SwxK30OwtHnrK4-J37NokLnoOg6HnyJogIv_I4sIn5Io5I3sI44R30O4lJ_nGgsJn1Fg6HnjEg2E3kCgoGnxCgsJvwDgsJnxCgsJv-BgsJ3rBoyJ3SgsJAoyJgZoyJ4rBgsJ4kCoyJw3Co1F4kC42D4rB4lJojE4lJo8E4lJgvFwuOwxKwjMoyJ45YowU40OwqLw_IgoG4wLghHwiFoxC43Kg2EwpEo4BokLgkDw-BwM4rBoGw-BwM4lJwlBwtHoG4zHnGwjM_xBo5Iv-B4hGn4BoyJ32D4lJvpEgoG32DouGvpEorKngIw4JvmI47NnvNgwMvqLgrC_qC4sInnH46G3oFwmI3oFgzIvpEw_IvwD4lJnxC4lJ_xB4lJ3SoyJ4S4lJgrC4lJgkD4lJojEgzIg2EgzIw7F4oFwpEgkD49CwtHonHg6H4sI4zH4lJ4yZg6gB44RguXojdo2lBgiOwrSw5QwvVghH4sIwtHgzIg2Eo8EwmI4zHg2E42DwmIw7Fo5IwiF4zHwwDojEo4BwmIoxCg9Dof4lJ4rBw3CoG4vEoGoqDAg-KvlBogIn4Bg6H_qConH_jDw4J3oFwpEv3CozQ_2LgvF32D4oFvwDg-K3hGwmI32D4sInqDwpE3rBo2M_jDogI3rBorKnfokLnfo6P_xBglKvlB4_QvlB4lJ_Yg5Z_qCwmInfw3CvMgkD3S4hG3rBgkDnf49Cnfo8E3kCw7FnqD4oFvwD4oFvpE4vEvpEo8E_uFw3CvwDg2EnuGoxC_8DwiF3sIwqLv9To7W_zoBoqD_nGwiF_rJoqD_8Dw3C_jDo8Ev0Go1FvxKwlBv3Cw-BvtHo4B_8DouGnkLgvFv4Jw3CvpEoxCnqDg9DnqD42Dv-BwiFnqDo5I3zH4hGn8EwpE39CojE39CoqDv3Co1Fn1FgkD3kCwiFv3CgvF39CwpEv3CgkD_xBgkc_6O4zH_8DgZ3So8EnxCwwD3rB42DnfwwDvMg9DAwiFgZojEofg6HwpEwgQ43KojEw3CwiFoqDwqLwmIw3C4kCwpEgrCojEwlBwpE4rBwpEofwtHwlB42D4SwrSoxCwjMo4BwrSw3Co1FgZw0Gofw0GofwzYwwDwoWw3Cg9cwwDwqLofwpEAghHAgsJ_Y40O3kCwiFvlBg9Dnfw0Gv3Co1Fv-BwmI_jDgoG3kCogI_jDw4J32DwpEn4Bg9D_xBwpE_xB4vEn4BwgQnuG4iNv7Fo3T_kKw7F32Dw7F_1EgvF3oFwxK3wLo5InkL4sIv8MogI_hO4vEv_I4vE_kKgvFvuO4vEn2Mo9LvgpBw0G_tXwmhBns1Dg9D_rJ49Cn5IokL_riBw7FvkTgvFvrSwpE3pMoqDn5Ig9D_5Ho8EngIwwD_1EwpE3vEoqD39CoqDnxC49Cn4BwwDn4B46G_qCojE_YwwDnGg2EwMg7O4kCgzhB42DgvFoGgzI_YghH4SgtQgZgpNoG4imBwMoxb_xB4kb_qCo4avwD421B3zH4gY_8Dg2dvpEw-a39Cg_RvlBg_R3Sg_RAg_R4rBg_Ro4BokLo4BonHofggZwiFgjVo1FooOwpEooOo8EooOgvFwyqBg_RoxbwqL4iNo8EgiOwiF4uWonH4jU4hGwiFgyBg9DwlB42c46G47N49CwvVojEokL4kCoqcwpEguXwwDo5Iofo4agkDorKwlB49CwM4zHofwhXgrC4shBoxCw-ao4Bw3b4rBwwcof4z5B4SgkcvM4uW3Sg6HvMo4BAoq1Bv3C41V_Y4wLnGg-KoGg-KA4qT4SoiWgyB4kCwMgsJofg1WgkDwyRgrCwgQoxCowUwpE4qsB4lJw9ToqD4wLgyBo6PgyBwgQwlBg-KoGwiFoGwgQvMg8V3rBorKvlBo-Sv3Co2M_qCwgQvwDwgQ_8D4mQn8E4mQ3oFouf33K4tPn8E4tP_1EwrS3vE4iN_jDo6P_jDg0PnxCwgQ3kCwgQ3rBwgQvlBo6P3SozpB3rB4_Qnfg1Wv-Bw5Q3kC4jUnqDwkTnqDoiWn8E4vEvlBg6H3kC4wkBvxKgwMnjEg4S_gHo2MviFowUn5IoonBvyRw7FnqDwtHvpEg0Pv_Ig7O_yIwrS3wLolS_2LolS_vMwqkB3raw4iB_4ZghgBntYopVn6PosR_oNozpBn1e4i_BnivB42DnxCgnY3_QgiO_yIo2MnnHwqL_uF4wLn8EwqLnjE4wLnqDwqLv3CwmI_xBogIvlBo9LvlBg6HvMg-KAwjM4SwrSgyBwrS4kCw8MgyBorK4rBgzhBgkD40OnGwpEnGg9DA4sI3SonH_YwxK_xBorK3kCo6PvpE4_Q_nGgiO_nGohPngIorK3hG4mQ33KojEv3C46G3vEgvF32Dg2E_jDg3kB35YgiOv_Iwla3mQoyJ_uF4tP_yIwlav1Ng-jB_sQ4yZ3-J43jBn2MwqkBnrKw1N_jDguXn8EomZvpEwzYnqD4gYn4Bo9L3SwjMnGgjV4Sg7OofwqL4rBokLo4B4pMoxCwxK4kCo9LoqD4wL42DwqLojEwqLg2EokLwiF4iNgoGgkDo4BonHg9Do5I4oFwiF49C4wLonHgpNw_IoyiBg5Z4wLgzI4kb41Vo6P4pM4oFojEg9D49Cok9Bw6wB4zHw7FojdwhXotxBwunBo1Fg2Eo1F4vEw_IonHwlagqUg4S40O44Rw8MovNgsJw1N4lJ47NgzIooOwmIooO4zHooO46GwuOgoGwuOwiFwtHgrCghHw-BwxKgrCgwM4kCwnPgyB4wLgZouGoGglK3SwqLnf4mQnxC4pM39C4iN_8Dw_I_jDgiOn1FouGv3C49C_xB4shBvnPg_qB_3So5I32DooOn1Fw5Q_nGgzhB_2L4tPn8EojdvmI4vdnnHg7O39CohP_qCg7On4BohPvlBg7OnGg7OwM40OwlBooOgyBgiOoxCooOgkD40OojEwnPo8EwnPo1FohPouGg9cgiOw8Mw0Gojdg7OotYwjMgnYg3Lg9cw8M43K4vEwqkBgiOo3TonH40Oo8EopVgoG4vEwlBwtHw-Bo9LoqDgwlBo5IopVojEoiW42Dw0f4vE4mQo4Bg6gBoxCozQgZwgQwMo0XAgsiB3rBw6X_xBwjMvlBw6Xv3Cw0Gnfo8EvMwnP_qCohPv3Cw7e_nGo6P32Dgya_gHwjlBvxKwvuB37NopVv7F4-Jv3CguXn8EwjM3kCoiW39Coxb_xBgwMnGgwMoG4pM4SwjMofgwM4rB4pMo4B4mQw3C4uWwiF47mB4lJgljB4zHw0GwlBg6H4rBo8EgZgyaw3Co2Mofg5Zofg_RvMokLvM4vEnGo9L3rBgwMn4BgwM3kCo2M39CgmRn8EwmInxCojE_xBwmI_jD4zH39CgpN_uF4mpB3xSgwMn8E4iN3vEwvV_nG44Rv3Cw8Mn4Bo2Mnfw8MnGw8MwM4iNwlB4iNgyB4iNoxC4iN49Cw8Mg9Dw8M4vEgwMo8Eo2Mw7Fw1mBo-Sw8Mw7F4iNgvFoiWonHovNwwDgpNw3CgpNw-B4iNofw8M4SwnPvMglK_YgwM_xB4pM3kCwjMv3CorKv3C4s6BvkTokL39Cg-KnxCokLv-BwqL_xBonHvMg6H_Y4wLnGg3LoGo9LgZgoGgZgvF4Sg3L4kC47NoqDwqLoqDo8EgyB4-JgrCwjMg2Eg3LwiF4wLgvF4wL4hGonHojEwpEoxCwqLwtHg3LogI4vdg8VwiF42D4-JwtHoxCo4Bw3Cw-BwpE49Cg4SgwMg3LwtH4gY47NwjMgoGozQogIgwMgvFgjuBg4So2Mo1FgwMw0GgwM4zHg6HwiF4mQo9Lw1Ng3Lw_IogIg-Kg-KwxK4wLwxKw8M43Kw1NwxKohPglK4tPoyJo6P4lJgtQ4oeoy7Bw1NomZ40O4gYghHorK4wLgtQ4-J4iNo2MohPwwDojE4iNw1Nw8MgwMo2MokL4pM4-Jg4Sw1No6PwqL4z5BgmqBo4aowUo8E42DouGwiFoqDw3Cwpd4nXo3TwgQwqkBo1ew2tB4toBo8dw-aw4J4lJg7OgiOg_RozQo7vB4jtBwzYo7Ww6XwoWguXopVg_R4tPg2dgnYw6XolSg6gBo7WowU4iN4_QorKw5Qw4JotYw8Mg5Zo2M4_Q4zHgzhBovNgmR4hGosRo1FosR4oFwmI4kCgyaouG4-iB46G4ra42DgqUo4Bw8Mof4vEwMokkBo4Bg7nB4S4yZgZw30BofosR4S4iN4SwtHwMggyB49C41uBgvFw7eo8EgiOw3Cg3LgrCw4JgrCw5QwwDg-Kw3CggZgoGw6XonHwieglKgjVg6Hwlag-Ko_Z4pMg5ZovNomZooOggZ4tPwvV47Nwwc4xS45Y4tPomZooO4yZ4iNwsZ4wLwsZorKw0GoxCouG4kCgtQgvFggZwtHwlaw0G4ragvFo4awpEw-zBw7Foxb49CgyagkDwlawwDgyawpE4rag2EwgpBgzIoyJ4kCo4zBgpNo_Z4zHgiO4vEwpd4lJgvFw-B4mpB47Nw4JwwDg5ZgsJ47mBovNo_ZwmI4-JoxCo6PwpEwiFwlB4hG4rB4uWwiF4xSoqD45Y42Dw6X49CotYw-BotYwlBwsZwMongB_YwmIvM4_Q_xBozQvlBgpmB_uFo_Zn8E4rav7F4gYv7Fg4Sn8E49b36GgwlBvmIg0PnxCwnP3kCwuOn4Bg8V_xBg6HnG4_QoGosRgyBosRw3Cw5Q42DozQo8E4mQw7Fo6P46GwnPg6HwuOwmIwx8BgwlBo6Po5I4mQg6HwgQ46GwgQ4hG4mQwiFw1N42D43KgrCo2MgrCw04BwtH4qTw3CwgQoqD4mQ42DgtQ4vEgtQ4oF4mQ4hGo0Xw4JguXg-KgjVorK4kb4iNooO4hGg-KwpEovNo8E4pM42DohPg9DorK4kCgpNgrCo9LgyB40O4rBg1W4SoqDnG4hGAwuO3So8E3SwtH3S4mQv-Bg9cn8EwiFvlBomZv0GwqLvwDgwMvpE4gY3lJgnY33Ko1Fv3C4hGv3Cg3Ln1Fw6XvjM441Dvj-Bg7yD338Bg2EnxCgrb30OwhX_oNguXnoOo7W_zPg0P3wLo6P3pMo6P_oNg3LvxKg0P30OwmIvmIgzI_rJorK33Ko1F_nGojE3vE43KngIgqUv2UgoGn1Fw7F_1EoqD_qCo4B3rBwpEnxC49CwMgrCwlBw-Bw-B4rBoxCwlBwiFo4BooO4rBgzIw3C4shB46GouxC4wLg2hE49CoxboqDo4agoGwrrBw3CgmRg9DopVwiFg5ZwiF4uWokLoivBgvF4uW46Gojdo4B4zH4rBw7FwwDgiOgkDokLgyBw7Fo4BouGgyBo1FwlB4vEw-BghHoqDwxKo4Bw7Fw-B4hGgoGw5Q43KwzYw7Fg3Lo4BoqD42DouGg9DgoG42Do1F4hGgzIgkDg9DogIw4J4oF4hGw0Gw0GonH46Gw-BgyBw3CgrCwtHo1F46G4vEg7nBopV4gYgwM4sIwpEw4J4vEw3C4rBoqDw-B4zgBg_RghgBgiO42DgyB4sIoqD42Dw-Bg9Dw3Co8EwwD49CofgyBAnG36GoGnnHwM3lJgZ_nGwlBv0Go4B36GwpEv1NgrC_gHgyBviFo4BwlBo4BgZw-BoGo4BvMoxCnfwmI_jDouG_jD4kCvlBoxC_qCgZ_Yw-Bv-B4vEnjEo4B_xBo5I_5HogI3lJwiF36GgoGv4JwpEvtHw-Bv3CgkD39CwlBnf49CnxC4rB3rBwlB3SgyBvM4rBwM4kCo4B42DojEojEg2EoxCoqDojEouGoxCg9Dg9Do1FoqDo8EwlBo4B4oF4lJg2E4sIwMgZnqD4hGv3CwiFnjEg6HnG4rBoG4rBgZgyB42D4oF4rBo4BwpEgoGv-B4vE_Yo4Bw-Bw3CogDkoF4c0yBwpEwxK4SgoGnGoqDofoqDwlBgkDAgyB3Sg9Dof4rBgZ4kCwwDw0GgvFo9L4zHg4Sofo4B4SwMwlBnG4rB3rBoxCgoG4oFg-KwmI48Uw-Bg2Eg9DoyJ4hGwjMgiOotYwwDgvFwlBofofoGofnGgyB3rBoG4oFgyB4zHgoGw6XgrCgzIoxCo5IwpEgiO4kCw7Fo4Bg2E42DglKg6HwrSg9DgsJwwDg6H49C4hGojEwtH42D4hGo8EghHo1FghHwpE4vEgkDw3CwhXolSguXwyR4vdo7W4pM4lJ4zHw7FwtHo8Ew0GwwDo1FgrC4hGo4BwiFof4hG4S49CA49CgZ49CoGgrCnGgvFnf4hGn4BgkDvlB4oF_qCgvF39Co7W_hO4-J3oFonHnqDg9Dn4B46G_jDw4J_8DgsJv3CwyR_8Dw-an8E4zHn4B4lJ3kCo2MvwDgiO_1EgwM3oF4qT3lJ4tP3sIw6wBnqcgjV_2Lg0Pv_IwxKn1F4wLn8EwxKnjE4-JnqDg3LvwD4mQ32DwqLn4BwmInfo-SwlB4zHgZouG4rBonH4kCwtH49C46GwwD4hGwwDg2EgkDgoG4oFonHouGgzIgzI46GouG4sI4wLwpEouGojE46GwtH47Nw9ToonBgvFwjMw_IolSwiFoyJwyR4hfwhpC4zkE4wLwvVwqLguXgwMwpdo5Ig1WokL4oeonHwhXw4JwxjBgrCorKwiFoiW49CgiOw-B4-JooO40gCwqLwrrB49CorKouG4qT4lJomZw4JwzYorKo0Xg-KoiWwqLopVg3L4jUo9LwkTo2Mg_RgpNgmRgpNohP47NwnPgiOovNwuOw8Mg-KgsJ45YwoW47Nw8Mgrb4ra4kboxbgkc4oewuO4mQ40OozQw5pBo_yBwsZw0fwjMg0PwnoBwsyBo4ag6gBokkBo-rBo4agofw5pBo7vBoqc4hfoqcgveou4Bo56BwyqBw5pB40OgiOgiO4iNwmIwmIg9c4ra42c45Ywpdo0XwjM4lJg_RgwM4tP4-Jg0P4lJwgQwmIgtQ4zHgtQouGozQwiF4mQ42DgtQgrCokLofwuOgZgoGnGoyJ_YgsJ3rBg4S32Do9LnqDw6X3zHowUv_Io1Fv3Cw8M3hGolSnyJwnPvmIo2M36GgpmBvoWwmhBv9T4pMngIooO3lJg3LngIwhX3_Qw4J3zH4iN33Ko_ZvoWwoW_iV4xSnlSg_R3xS4ranjdgwlB3_pBolSn3TozQ_lRgiO37N4tPvuOgiOvjMozQv1N4wL3lJ4wLn5Iw4J36GglKv0G41Vv1Ng3L_gHo7WvjMwuO_nG4lJ_8D4nXv4Jo5hB33KohPvpEw5Q32DovN_qCoqc_jDwhXn4B48UnGg_Rofg2dw3CwuOo4Bo4a42DouGgZ4jUo4BwxK4So5IoGgzInGogI3S4iN3rB4wLn4Bw_I_xBonH_xBg6Hv-B4sInxC4-JnqDwjM3vE4-JvpEo1Fv3C4pM3hGwtH_8DglK3hGgmRvqLoqD_qCg3L3sIgtpBv7eokL_5HgwMvmIo6Pv_I4sI3vEo9L3hGglKvpEosR_nGojE3rBwjMvwDgzI3kCouGnfo1FvMg6HnfowU3kCwrSoG4zHwM44Rw3C4oFwlBo9LoxCg_Rw0GwmIoqDwjM4hG43Kw7Fg3LwtHwrSovNojEwwDo5IogI46Gw7F4tPo6PwtHgzIw1N4_QopVoghB4vE4zHo1Fg3Lw0G40OwwDw4JwlBg9DwlBwiFojEg_R4kC46GgrCwiF4rBw-BgyB4rBgoG_hO49C3hGo5I_wTgkD_gHoxC3oF42D_5HwM_Y4sI34R4S3rB4lJn3TwpEv_I4hG3iNoxCn8Ew0G_oN4vEn5Iw_I_lR45Y3xrBowU_9jBg6H37NwwD3hGg9D36G4oF_yIwoW3imBgyBv3CwoW37mBgrC_8Do4BvwDwjM3jUgzIn6PwoW_omBg2EngIw3C_1EojE36GojE_gHorKvyR44Rv7ew3C3vE46GvjM4kC32D4rB3kCg2En1F42D_8DwlBvlB4kCv-BwyR37N4oF_1E49C_qC49Cn4BwiFn4B49C3SoqDnGo1F4S42D4Sw3CgZo4BoGwiFwMoqD3SwwD_xBw3Cn4Bg2E32Dw3Cv3CgkDgoG4kC4vEoxCg2EofwlB4kC4rBofoG4rBnGw_Iv3C4kC_Yg9D3kCgkD39C4kCnxC4vEnjEwlB3rBwpEgZoqDwlBwpE4rBwwDgyBghHofgoGw-BgoGgrCgrCof4SA4SvMwM_Y0tBrsG8Q7sC4Sn4Bo4BvwDgvF4hG42Dw3Cg9D4kCg9DgyBoqDgZo2Mo4BonHofoyJo4BoqDgZw4J4kCgyBoGgvFofw3C4SoxCwM4oFwMo1FoG42D4rBw3C4kC4rBo4Bo4Bg9Dw-B4hG4kCghH4S49CwMojEoG4vEoGg2EAgrC4SghH4kCorKgyBwiF4kCgvFo4B42D4sI4mQw-B42D49CgvFojEw0GgrCojE4vEg6HgkDw7F46Gw8MwwDghH49CwtH4rBghH4SojEwMwpEgyBoufnG4zH4SwjMwMo8EwlBonHoxCw4Jw-BgvFwpEo5IwmI4pMgkD49CgkDwpE49Cg2EwwDwtHgyB4vE4rBojE4kCgsJgkDg4So4BoyJ49CwjMgrCghHw_IguXo8EgwMgoGwyR49Co5IgyBg2EgrCwtH4S46G4kC46GojEgwMwiFg0PokLgzhB42Dg-Ko4Bo1FojE4pMg2EgiO4-Jg2d4sIg5Z42DwqLwlBwwDof49CwtHguXgoGg4S4kC46GwiFwnPw1NozpBwxK46f4tPoivBouGgxTvtHoqD_1Eo4BnxCoGnxC3S_qCn4B3kCnxCn4BvwD3rB_8D_Y3vEnG_1EwM_1EgZnjE4rB_8Do4BnqD4rBn4B4kCv-BgrCvlBouGnGwyRoGoqDnGw4Jv-BouGoGw5QwlBg5Zw-B4qTofo2M4So2Mof4zgBo4Bg7OwlBozQw-Bw7FofwiFofwmIgyBonHo4BohPwpEg7Og2EouG4kCokLwpE48UgsJ41VwqLonHwpEonH4vEwoWohP4tPg3Lg7Oo9LwtHw0G4zH4hGwtHghHokL43Kg_Rg4SwvVw6X41VwsZ43Kw1NgzIwxKo8Eo1FosRwoWg1Wwie4iNg_RghH4pMgvFgzIowUgve4kCoqDwnPwhX41Vw4iBo1Fw4Jw0Gg-KgkcgnxBg7Ooxbwwc4v2BgiOgrb47N4oeorKwzYglKwzYw4J45Yw_IggZw5Qw6wB4lJg2d47NguwBonHgrborK4_pBgoGwwc4vEg8VgsJguwBgiOwpvCo9Lg7gCg3Lox0B4wLo3sBw7F48U4pMwunB44RomyBgsJ4gYglKw6XwxK4nXw3CgvFwmIosRwqL4uWo9L41V4pMwvVo2MgqUgpNw9TovNo-S47NwrSooOosR40O4_Q4sIw_I4hGw0Gw5Q4_Qgkcw-ag0PwuOongBoxbg-Kw_IozQgpNg9D49Co5IouGg9D49CwoW4mQozQ4wL4_Qg-K4zHo1FgiOgzI4zgBo-Sg8V4wL4_Qo5I4kCofo4BgZwvVglKgzI42D4mQghHggZw4Jg4rB4tPo9Lg9D41VogIgmR46GgmRwtHw5Q4sIozQo5I4mQoyJo9LwtHghHo8EgzIgvF43K4zHgzIouGgxT4tPo-SwgQ4xSgmRghH46G4pMwjM4tPwgQohPw5QwuOw5QwuOwyRgkcg-jBw1N4xSozQguXgsJgpN4wL4_Qw9T4hf4zHg3L47NwhX4wLo3Tw9TgljB4_Qouf47N4kb4oFwxK41V4jtBwzYo82BwxKotY4vEg-KozQ4toBokkBoo5Cw8MongBgrbwnhCojdwnhCwuOo8dg7Oo8d4wL4uWgoGg3L4qT4-iBouG4wLozQgkc49Cg2E4wL4xSwwDw7F4pMo3To4a40nBoyJw1NwoWgve47NwrSgiOosR4pM4tPwtHw_IgwM40Ow9TwoWwyRwkTg_8C4rlDo-SwvVwyRgjVgmR48U4rao5hBw7e4_pB4mQ4nXwgQw6Xo3Twie4xSg9cwwDgvF4nX4-iBg7O4gYwsZ4imBw-ao9kBg1Wojd4iNwgQohP44RouG4zHgvFgoGohhCgnqCwyRw2U44Rg8VgmRoiW4iNwyRwpdgtpBohP4uWw8Mw9TwwDo1F4-JwgQg9DgoGolS4oe4tPw-ao2Mo7WwmI4tP4wL4uWwunBoxtC49Cw7Fg-K41VwiF4-Jw6XwksBwjMw2U45YwunBg1WwmhBgpNolSw-ao5hBo6P4xSg-K4pMohPo6P40O40O40OgiOwuOw8MwuOwjMohPo9Lg7OokLwnPwxKg0PglKgpNogI4xSorK4tPg6Hw4Jg2EgtQwtHwuO4hGwoWo5IwhXwmIo6P4oF4vE4rBwiFgyBolSo1FgnYgoGg6gB4zH4liBouGovN4kCotY49CorKofo0Xof42DAg2EAoiW_Y4zH3SwrSn4Bo0X_8Dg0P_jDg6Hn4Bo2MnqDw9sB_vMozQvpE40O_jDwyRnqD4xS_qC46G_YogI3S4_Q_YwqLnGg-KoGo9L4Sw_I4SovN4rB43K4rBwqLw-BgwMw3Cw4JoxCokLwwDokLwpE4lJg9D4wLgvFgpNwtH44Rg3LgxTohPglKo5Iw_IgzIo5Io5IgsJorKg6Hw_IonHo5I4lJo9Lo5Io9Lg6H4wLw4J4tP4pMw2UguXg0oB4pMw9TwmIo2M4lJovNgzIo9Lw8MgmR47NosR43KgwMokLgwMg3LgwMg3L4wLwhXwvVglKw_IokkBoghB4wLwqL4_Qg4Sw_Ig-KwnPw2Uo5Io2MogIgwMgzIgiOgzIwnP4oFglK4oFglKouGgpNo1Fo2MghHwgQ4zHwkT4hGgtQonH48Uw5QgyzBw0Go-Sw7FwnPo1Fw1N4sI4xSoqDghHouGwjMw7Fg-KoqDo1FwiFw_IoyJohP4hGw_IwmIokLo5IokLoyJwqLo5IgsJwxK4-J4vEg9D4vEojEg9DgkDo4B4rBonHo1Fw_IouG4zHo8EonHojEgzI4vEosR4zHoyJoqDwmIgrCo5Iw-Bw_IgyBgzIwlBg_R4rBolSAo-SvlB4xSn4BonH3S4wLnfgve_jDosRvlBw-an4B41V_Yo2MAg4S4SgjVgyBwxKwlBg4Sw3CorK4kCg0P42DwrSgvFokLojEgtQw0GovN4hGo3TglKgsJgvFwqLghHo7Wg0PohPwqLohPo9L4iNg-KgxT4_Qg7Ow1NwxKorKgofw0f4lJ4-Jg5Zoxbg-KokL4sIg6HoyJ4sIgsJ4zHoyJwtH4-JonHg6HwiFgtQgsJw0GoqDgsJwpEg0PgoGwxKoqDw_IgrCgzIo4BgiOgrColSo4BwvVof4wLnGo3T3rB4pM_xB4jU32DwnoB_kKotY_uF4vEnf4sI3rBgmRv-BgsJ3Sg3LvMgwMwM4sIgZ4sIwlBo5IgyBw1NoqD4hGw-BwqLojE4lJojEogIojEg6H4vEwmI4oF46Go8EgvFojEoxCw-Bw4JwmIgoGw7Fg6Hg6H4lJw4JgoGwtH4sIwxK46G4lJwgQw6X4tPo_ZouGwqLwjMwoWo9Lo7WwqL4nXg-KguXogI44R4zHg_RghH4_QgrCo1F4zHg4Sw_IwhXo6PolrBg2EgiOgoGg_RgwM4imB46Gg8V42Do9LwiFozQokLw1mBgoGo7WgkDo9Lw8MwzxB4lJ47mBwqLg5yBw-Bw_Io1Fwwc4sIg4rBorKo56BgoGwjlB4hGgzhBw4JgyzBwwD44RogI4plBglKgxsBw1Nwt5BwmIoghBgiOo82Bo5IwmhB4xS4_iCorKgljB4sIgrborKghgB40OwksBolSwsyBg6H48UwkTguwB4-Jw6X4qTo3sBw5QwqkBwqL4nXw3CgvFg9DwmI49C4hG4zgBw1_BozQ4zgBg-Kg1WwmIosR4mQg-jBwgQ4imBwxKwlaw4Jg5ZoqDo5IorKg9cglK4vdoqDw4Jg0P4gxBonHo0Xg7OgjuBg6Ho7WogIoiWwmIgjVwtH4xSg3Lw-aw8Mw3bosRw_hBoyJosR4xSgof4lJwuOglKwnP4jUw3bg-KooOg-K4iNg-KgwMo-SgqU4lJ4lJ4zHonHorKoyJgsJogI4-JwmIohPg3L4tP4wLo0XolSw1Ng-KglKo5IohPgiOw5Qw5Qo5IgsJg_Rw2UoyJg3L46Go5IghHgsJ4mQo7Wg0Po0XokLg_RojEghHgvFgsJgsJ4_Qo8EgsJorKw9Tw9To6oBogI48Uw4JgnYglKw-awnPozpBgqUw30BovNoghBo2Mo8dw0GohPw_I4qTo9LggZwwDwtHwmI4mQonHooOo1F43K42DghHouGwjMgwM4uWwnPo_Zo2MwoWw2Uo5hBo-SghgBouGokL46Go2MgtQo1ew0G4iN4tPgofghHg7O4jUwksBg4So3sBghH44RogIw2Uo2MoyiB4wLg6gBg-K4shBouGowU4-JwmhB49C4-Jw-BghH46G45Y43K4mpBovNon5Bg6HwxjB49C40O4oFo4aw0GokkBonHolrBojEo4a49CgqU46GgyzBonHwklCwwDw8lBohP4i8FgkDwxjB4hG4h4BwwDwpdg9Dg9cg6HotxB4vEo_Zo8Eg5Z4sI4toBojEolSgvFg1Wo8EgxTouGgnY4hGw2UonHg1Wo1FwgQgvFwuOwjM42c4oFokLonH47NouGg3LozQgyaoyJo6PogIw1No8EgsJ4oForKwiF43KwpEw4JgoGwnPw0GwrSonHg1Wg2Ew5QgoGgrb49CovNw3CovNg2E4kb4kCgiOo8Ew4iBwtHw_6Bw-Bg0P49C4jU49ColSw7FoufojEwyRgkDwqLofoqDorKw_hBghHgqUoxCw0G4vEo9Lg2EokLgzIo-Sg2EorKgoG40OojEokLo4Bo1FoxCglKgrCo2MofghHofo9LwM4iNnGg0P3SglK3rBg7OnfwmIv3CgtQn4BglK_YgoGvlB40OnfwoWnGguXAwqLvMo4aAo1FAw7FnG4zHAonHAg0PwMw_hBwM40OgyBw4iBgrC4oegZ4zHofoyJoGo4BwMgkDgZ46GgZ46GofgsJo4BgtQgZwtHoforKgZouG4Sw7F4rBo9LgyBwuOoxCg5Z4kC4jUw3Cg5ZgyB43KghHo9kB49CwuOw-BgsJoqD4tP49C47NgZgkDwMg9DgyB46GgrC4zH49CwmIw-Bo8EwiF43Ko4BwpE4kC4hGgZ49CgZ46GwMo4Bo4BgZw-Bofof4S4SoG4rB4SgkDw-Bw-BwlBgvF49CghHwwDgvFgrCw7F4kCwiFwlBg9D4Sw-BoG4kCAwlBAo8EoG4zHAw-BoGoqDoGg9D4SoyJ4kCw_I4kCojE4rBg2Ew-B4sIgkDg-Kg9DouGoxC4sIgkD46Gw3C42DwlBw4JoqDofwMgZwMojEo4BgZwM4rB4S4rB4SwmI42D4rB4SouGoqD4kC3lJgyBvmIoG3rB4SnqDoxCn9Lw0B_xG",
          transport: {
            mode: "busRapid",
            name: "FlixBus N150",
            category: "Coach Service",
            color: "#73D700",
            textColor: "#FFFFFF",
            headsign: "Aalborg (Busterminal)",
            shortName: "FlixBus N150",
            longName: "Medyka - Berlin - Aalborg",
          },
          agency: {
            id: "65528_ba99721",
            name: "FlixBus",
            website: "https://global.flixbus.com",
          },
          attributions: [
            {
              id: "d2a3dda55cb717c0cc9a9d085a4e6870",
              href: "https://flixbus.com",
              text: "Information for public transit provided by FlixMobility GmbH",
              type: "disclaimer",
            },
          ],
        },
        {
          id: "R2-S5",
          type: "transit",
          departure: {
            time: "2025-10-01T08:55:00+02:00",
            place: {
              name: "Aarhus C FlixBus stop",
              type: "station",
              location: {
                lat: 56.152223,
                lng: 10.208635,
              },
              id: "65528_1080",
              code: "AAH",
            },
          },
          arrival: {
            time: "2025-10-01T12:25:00+02:00",
            place: {
              name: "Copenhagen Busterminal",
              type: "station",
              location: {
                lat: 55.66449,
                lng: 12.56091,
              },
              id: "65528_6763",
              code: "KHG",
            },
          },
          polyline:
            "BH4h2gvhBo392iG41B_2G3hG3vE_qC_xB_qCw0G3SgrCnGgrCoGoxCgkDohP4S4rBgZofofA3SoqDnG4rB_xBwmI3kC4lJnuGnqD3rB3SvmI32D3rB3S3rB3S_YvMnjEn4B_YvMnfvMv4JnqD32DvlB36Gv3C3sI_jDnuGnxC_9K_8D3sI_jD_1Ev-BnjE3rBv_I3kCnyJ3kC_8D3SnqDnGv-BnG3zHAn8EnGvlBA3kCAv-BnG_8D3SviFvlBv7F3kC_uF_qC_gHvwD_uF39Cv-BvlB_jDv-BwMvlBA_xBnGv-B_Y_qC_qCv7FvpE3-J32D_5H3vE33K_nG34RnqDvjM_qCn5In4B_1E_jDvgQ_xB3sIv3C_oN3S39Cv0G33jB3rB_kKn8EvvuB_YvtHnfv_I3S_nGn4BvyRnfv4J_Y3zHnf_yInfn5IvM3hGv-B34Rnfv_I_Y_gH3S3hG3S3vEv-B3qT3rB_lRv-B_5gB3S_oN3S_4ZnGvoWAnuGnGnrKA_gHA_8DAv7FA_1EwM37NwM_lRAvuOAvxKAnyJA_yI4SvnPwM3hGgyB_oNwlB36GoxC3iN4S_1E4rB3-JgyB30OgZ_9KwM_6OnG3-J3S3-J_YnnHnfvtHvlBv0Gv3Cn9L3vEnhPnxC36Gv0G30OvtHvnPvmInlSv0GnzQ_nGnsR_1EnoO_5H_xa_xB3hG3rBn8E_jD_vM39Cn2M32DnlS3kC3pM3rB_rJ3vEvpdv-B3tP3lJn0pC_jD_7V3kC30OnxC_6OnjE31V39C_hOn8Ev2UvtH3rannH3uWv4Jn_Z_5HvrS3zHn6P32DnnHn2Mn7W3nXvnoBnuG_2L_gHv1N32D_5HnyJnpV32D3lJ_5H_iVvtHnpVvwDvqL36GvsZv4Jn2lB_8DvgQ32DnzQ36Gv0fv7Fnjdn5IvzxB39CnlSviF3liBn1FvrrBn1F390Bv7F_zhCngIvpoD_1E3l7BvwD_omBvwDv4iB_8Dn5hB_8DnngBn8EvxjB_qC_zP36Gv1mB3kC3pMv-B33KnuG_kjB3sIv5pBv7Fv3bv0G_8c3sIv4iB39C3wL_qCnyJv7F_7V36GntYnoOvhwBnrK3zgB33KvtgBnrKvpd3-J3kb37N33jBv0Gv5Q36GvgQvkTvrrB_3S_6nBn-Sn2lB_nG_2LnuGvjM_8D_gH_nG3wL3nXvnoB3lJ3tPnvNnpVnzQ_8cnvN_tXnuG_2LngIvnP_jDv0GvmIvrSnuGn6PnjE33K_uF3tPvmIn_Z_uFv9TvwD30O_2L3k0B_jDn2M_qC3sI3rB_1EvxK3hfv3CvtH3oF_vMv0G37NvpEvmI_8D_gH3vEvtH_9K3mQvla3-iB_vMnlS_5H_vMv1NvzYvrSn1e_oNvhX3zHv8M3tPv6XnkL3mQ_6Ov9Tn7WnqcvtHvmI_vMnvN_kK_9K3xS_-R_uFn8En8E3vE_oN_9K_vMv4Jv0f3gY_zPn9Lv4JngI31Vn3TngI3zHnpVvoW3_Qn3T3jUnmZn-S_xa_yIn2M3lJvuO3lJnhPnnH3pMvxKn-S_9KnwU3zHvnP_5H_sQ_gH3tPvuO_yhB_5Hn3TnnHvkT_gH3jU_hOvyqB3iNv5pB_9K_kjB3iNvunBnoO30nBv4J_4ZnxCnuG3-J_4Z_gH_lRvvVvzxBvtHvgQ_6O_nf3zHvnPv2tB305CvmInzQ3hG_vMn7W3gxBv2U3uvBnuGvnP_gHvyRv2U321Bn1FvnPn2MvxjBvmI3gY_kKv7ev_Ivwcv_I3vd3sI_8cn5I_nf3lJn5hB3nX374CnrKv5pBvjMvsyB_zP31nCviF3gYvxKv73B3hG_yhBn1Fv_hBnkLv8-B_5H3mpBnjE3qTvlBv0G_8DnlSvlBn8EvlB_uF3pM_81B3mQvugC_jDvqLv-B3zH3iNnwtBvpEvuOn4Bv7FviFnzQ_kK3zgB3wL_kjBvtHnpVv8MvqkBvxKv3bnkL39b3kCn1F_gHv5Qn4BvpE3iNn8dvwDngI3vE3-J_oNn4a3iN3yZnsRv0f_vMvvVngIv8MnnHnkLnnHnrK3zH_kK3zHnyJ3zHn5IngI_yI_yIvmI3zH_gH_rJ_5HnvN3-Jv1NngI3lJn8E3lJ3vE_rJ32D_rJ_qCv0Gv-BnkL_qC36G3rBvtHvlB32D3S_1EvMnyJAvkTgZn8EwMv1NgyB_gHofn5IgyB39CgZ3_QwwDvkT4vE3raw0G_yIo4Bv8Mw-Bn2M4rB3vEwMn2Mof_5HoG_1EoGvpEnGnnHnG3oFnGnuG3S_nG3S3sInfn2Mv-B3sI_xB_yI3kCnvN_8D_hOviF33K3vEv0G_jD_5HnjE_yIn8EvmIviFvmI_uF_yI_nGv4J3zH37NvjM_gH_gHv_I3lJ_3rBnpuBntY35Yn2MvjM3wLnrKnlSvgQ3pMnrKn2M_kK_zPn9Lv2UvuO3pM_5H3pMvtH_yI_1EnkLn1F_sQ3zHn9Ln8E_vM3vEvjM_8D3wL_jD3pM39CvxK3kC_gHvlBv8Mv-B_pUv-BvievlB3iNA38U4S3jUwlBv6Xo4BviF4S_8DwM3mQ4rB_uF4SvkTw-Bn-So4B__YwlB_9KA33K3SnsR3kC_2L_qCn9L_jDv8M3vEn2M_uF3vE3kC3sI3vEnnH3vEvuO3-J3-J_5Hv3C_qCnqDv3Cv1Nn2MviF3oF3iNvuOn5I33KngI_9KvmIn9L3pM3qTnnHn2Mn8En5Iv7FvqL39C_nG36GnhP3hGnoO_uF37N36Gn-SvrS3h4B36Gv9TngI31Vv7F30O_5H34RvtH_sQnuG_oN3zHvuO3lJ3mQ3lJvnP3sI3iNnzQ_tXvtHnyJ_yI33Kn5I3-JnyJnrK_yI3sIvnPnoO_7V_wT33jBnghB_vMn2M_kK33K3lJ_kKv1N3mQ_vMn6Pv8MnsRn5I3pMv4JnoO3sIv8MnkL_3SnkL_3SvjM_iV3xSn1enzQ_mYn5I3wL3lJ3wL_rJ33K_kKnkLnrKnrKv4Jv_IngI36G3lJvtHngIv7FnkL3zHn5I_uF3iNvtH_2Lv7F_rJ_8DnkLnjEn9L32D_rJnxCn9LnxCvqLv-B3wL_xB_9KvlB3pMnf31V3S3-JoGnvNwMvyRgyB3_Q4kCn3TgkDnzQ42DvgQojE_ptBo2Mn0Xw7F_vMoxC_2Lw-B_2Lo4B3iNgyB_uFwM3tPof_kKoG32DAn5IAnyJnGn3TvlB_8cvwD_wT_jDnsRnqDvzYviF3tP32D3kb3zHnjEvlB_1E3rB3xSn1F_7VnnHvlav4JnmZ_kK_3S3sI_oNnuGv5Q_yIn2MnnH3qT_2Ln0XvgQvjMn5I3wLn5IvxK_yIn2M33KvoWnwU31VnpV_iV_0W_jD32DvyRnwUnwU3yZnzQvoW30O_iVvqL3_Q3xSnjdnlS3hf30On4a3sI3mQvuOv3bnrKv9T39C3hGn1e338B_wT3plBvjMniW_hO35YnpV_kjBvyRvwc32Dv7F_5Hn9L_kK3tP_yhB3uvB3iN34R3iN3_QnzQnwU3nXv3bn5hB_hnB3xrB_mxB30O34RnrKn2M_jDnjEv3bvxjB3tP_iV3pMnsRvtgB3gxB_xav5pBv0GnrK3iN3jUv8M3jUv9T3vdv9T_8c_uenzpB36f3toB_9K3iN3-JvjM_7uBnq1B_oN_hOvx8Bn6hCvyR_wT30O_sQnzQn3T_1E_uF_2L_hOn8Ev7F_4ZnghBv1NvrSnmZ33jBvjM34Rv2U36f_-Rn8dnxC3vE34R_1d32Dv0G_9K3qT3sI3tPnmZ3gxB_sQ_yhBvwc3i_BnlS_lqBnsR3_pB_kKnmZ3wkBn66C_oNv0f32Dv_I39C36G_lR3toB3xSvgpBnxbnn5B_jc321Bv_IvgQ_oNvzY39C3oFvpEnnH3yZ3toBv_I_6O_2L_-Rn2M_3SvxKvnPnngBn-rB_lR_7VnsRvvV37N3mQ_hOn6P_hOnhPnsR34R3wLnkLnlSnzQn-Sn6P3qTnhPn6PvqL_wT3iNn3TvjM3jU_9K3jU3-J_pUn5I3jU_5H3jmC35YvzYnyJ34R3zH36G39C_xa_vM33Kn1F_8D3kC3rB_Y_xB_YvtgBnsR_pUn9L_6O3lJ3iN3sI3nXn6Pn_Z_3SnsR_oNngI_nGv4J3zHv3b_tX_0Wv9TvoW38UniW31Vn5In5IvpE_1E_yI3lJnrK_2L33Kv8M_pUn_Z3iNnlSv8MvkT3pM_wT3zHv8M_kK_-RvtHnvNv4J3xSnkLvhX3tP3liBvtHvyRnzQ34qBv7Fv5QnnH31VvjM_hnB3iNv6wBnqDnoOnuG3kb_yI3_pB_0Wv3_D_rJn7vBv_InsqB3rB_uF3sIvxjB36G_xa3zHv3b_5H_xav7Fn-Sn2M37mBnuG3xS3xS35xB3pM3oen2Mvpdv-avm6B_hO_jc32cnj2BnrKnlS3nXnhoBvsZ3mpBnvN_iVnkLnzQ_gHv4JvtH3lJnqDnjE3zHnkLniWv7e_1E_nGv2U39b36G_yI39CnqD_vM_zP3sI3-J38UvzY_mYv3bn8E_1En5Iv4J32D32DvjMn9L33K3wLnkL_kK_-R_6O_yInuG33K_5H_5H3oF_6O_rJvmIn8EvmI3vEv5Q_yInzQnnH37N3oF_5HnxC_8DnfngI_qCvuOnjEnzQvwDnuG3rB_qCvMv_I3rBn5Inf3tPvlBnoO_YnhPvlBv5QvlBvjMvMv_I3Sn1FvMvwDnG_kK3S_lR_YvhXvlB_8c_xBvwDnGvjlB3kC31V_xB_vlB_qCvmIvM3sInG_sQoG_yI4S_8DwMnzQgrC3xSwpEn_Z4zHv8M42D_5Ho4B_zP4kC3lJ4S_2LoGn5I_Yn5Inf_yI_xBn8EvlBn-Sn1F3zH_qC_yI_jDnyJ32DvzY3-J32D_xBn_hHvy8C_8D_xBnoOv7F3kC_Yn3TvmI_2Ln8E_9Kn8EvrSngI_xan2M3zH32DnnH_8DnqDn4Bv8MvmInzQ3pM_vMvxKn6P3tP3tP3_Q3sI_kK_uF_gHv8M34R_pUv0fnkL_lR_iV32cnoO3mQnkL3wLnyJ3lJv4Jn5IvwDv3C3sI_gHvjMn5I3pMngI_vM_gH_vM3hG_hOv7F33KnqD_vMnqD_nG3rBvxK_xB_yInfv5Q3S3_QgZv4JofnlSgkDvjM49C3oFwlBnyJw3C_uFw-B_uFw-BvjMo8E_vMo1F3oFw3Cn9LgoG_yIo8EvxK46GniW4tP_jcgjV3jU40OnqD4kC_gHo8EviFgkD3sI4oFvtHwpEn5Ig2EnrKo8Ev7F49C3sI42D35Yo5IvxK49CnrKgrC38U42DnyJofvqLgZv5QoG_rJvM_2LnfnrK3rBv0Gnfn8dvwDnqDvM3kCvM_ue_jD_wTvlBn0XoG_tX4rB_9KofnpVgkD_pU42DvvVo1FnzQo8E30OwiFvlaglKv_IojE32DgyBnhPonH3_Q4lJv3bgtQnrKouG_5HgvF3lJghH_oN4-JvoWg_R_0WgxTv1Nw8MvuOwuOnlS4qT_xzBou4B3kbg2dnsR44Rv0fw7ev_hBwiev1NwqLvxK4sI_lRw8M3vEgkDvhXo6P_7V4iN_1dwyRntYwjM3wLwiFv1No1FvuOgvF3hG4kCviegsJvxKgkDvxK42D3qT46GnrK4vE3lJg2EnrKw7Fv_IgvFnoO4-J_hO43Kn8EojE_zP40On2M4iN3pMw1NngIw4J3wLohPnkLg0P30O4uW36Gg3LnzQo1e_5H4mQ3wkB49tC3-JgxTviF4lJnzQojd_oNw2U30OopVn5Io9LnvNw5QnlSgjVvvVwoWvjMg-K36Gw7F_zPgwM38UwnPnkLg6HvnPw4Jv7ewyR3wLo1Fnqc4iN_9Kg2En0X4sInyJ49CnwUgvF_kjBwtH_8c4oF_zPgkD3iNoqDnoOg2E_5HgkDngIoqDn5Ig2En5Ig2E_2LwtHvjMwmI_6OwjMvkTosR36GghH_gHg6HnvN4mQv_Ig3Lv8MolS_gHwqL3lJwnP_zP49b_riBw1_B_zPw3bn9Lo3T3pMgxT_qbwunBvjMwgQ3lJ4wL3xSoiWn9LovNv2UwoW_jcwwc_-Rg4SviFwiFvmIw_I_2LwuOnkLgiOn2M44RvmIgwM_2L4qT3-J44RvmI4mQ_kKwvV36G4tP3lJo7WvmI4uWn1FozQv7Fg_RnkLginB_uFwhXn5IwyqBnqDwyRnxCw5Qv3Cw9TnqD4oenxCongBvlBgjVnxCo9kBnf4sI_xBovmB3So5Infw5Q3rBgmR3hG47_Bv3bwyrI3hGo13B_jDw7enqDongB3rBw1N3oFo7vB3-JwvgDnjEo5hB32D4kbn1Fw7e_1EguXv3CgwM39Co2MnxCoyJvtH4ra32Do9L3hGgxT_1EgpNv_IwzY_vMgvenlSg3kBnyJosR3iNoiWn5Iw1NnjE4oF3sI4wLv0Gw_I_5HglK_rJ43Knxbojd_lRo-Sv4Jo9L3oFwtHn8EghHvwDo8EnsRg9c3wL4uWnqDwtHviFokLvjMw0fnjEo9Lv3C4sI3zH4kbnqDw1N3vEo-S3oFg5ZvxKoq1B36fog-E3nXwnzD3sI4_pBnlSg06CviF4yZnjEgqUnqDwgQ_gHgsiB_uFguXnyJg3kB36Gg1Wv0G48UnyJoxb3hGo6P_rJoiW_nGovN3sI4_QngIohPvgQ49bn6P45Yv4JooO_5HwxK3ra46f34RwkT3mpB4jtBvkT4jU3tPg_RnkL47N3oFonHn5Io9L_kKg7OnyJ4tPv7F4-Jv0GwqL3hGokL_uFg-K_gHg7O_nGgiOvtHwyRv4JwsZ_hOgmqBvtHg5Z3vE4_QnjE4mQ3zHo5hB_5HwunB3jtBwliH3pM438Bv3CovN_4ZgkgEv8M40gC37NgqmC_yIwyqBn1egr4E37N47_B_2Lg5yB37N4z5Bv8M4yyBv9T4npC3zgBg_1D3vE4_Qv-BonH_vMw9sBnxCo5InyJw4iBv7FopV3lJ4shBngIojd3iNwvuBv4JoghBn1Fg_RvjMw4iB_rJgnYnjEw4Jv_IgxTviFokLviForK_1Eo5IvwD46G_jDgvFnhPomZv7FgsJngIo9LnyJovN_yIo9L3pMgtQ3l7Bo4sC3hGwmIv_IgpNn5Iw1N3zHgpN_yIgtQn5Ig_RnnHwgQnyJgnY_1Eo2MvpEgpN3sIg9c_qCgzI32Dg0PnrK4gxB_jDohP3oFo_Z_6OgxlCvtH4zgB3wL4uvB_gH4ra_2LgmqB34jC4vlHvuOwhwBn9Lg0oB3iNwksB3vEwgQ_1Eg0PvxKoyiBv7FwrSnrK4zgB_hOgtpB_9K4vd33Kgrb_jDwtHnqD4zHvmIg4S_oNojd_1E4-JnrKgqU33KgqUnhPo4a3sI40OvvVw4iBv4JwnPv7ewvuBv2tB44jC3jtBgxlCnuG4-Jv_I40O3sIgpNn3ToghB__Yo-rB_mYo3sB_hO4kb35Yg5yBvqLw6XnyJgjVvtHgtQ_hOwtgBnvNongB_rJguX_3SwhwBvxKoqc_2LongBnyJoxbvuO44qBvsZw3tC3pMw8lB3kCghHvtHwoWv0G48UvuOgxsBvuOgxsBvksBg3oEn3Tor8B_kKongBn5Iw-avvVg0hC_-R4h4B_sQ45xB34Ro13Bv0G41Vn1FgxT3zHw3b_8DwnP_uFwoWv3CokLv3C4pMvmIginBviFg2d_gH41uB32D4kbn4BgtQ39CwwcnxCongBn4Bwwcn4Bo0wBvMwrSA43KAouGwMg2d4Sgofw3Cg6yC4hGwn-FgyB4k0B4rBo6hCgZwiwCvMgs7Bnfo_yB3S41V39CwvnCnqDor8BvpEor8BnjEguwB3oFww1B_qCgqU_8DgljBnnHwm6B3zHw04Bv1No66C3-J438BviFg9c3zHwgpBvmIo6oB_kK4nwBvxK4nwBvtHw0f_9Kg4rBvmIgofnjE40O33KwunB3iNowtBvxKg7nBvnP438BvrSwiwCvnPgupCnxCw1Nv-Bg-KviFw3bnlSg6rDvtHw5pBv_Ig8uBn5I44qB3hGgrb_jDw1NngIokkB39Cw8M3vEw5Qv8M4rzBv5Qwj-B_xa4x9C32Do2M_uFgmR_1Eg0P32DwjM3-JoyiBniW4rsC38UgnqC_uF4qT_6O464B_jDw8MvpEw9T_rJwnoB_gH4-iB_jDosR3vEwzY32Do_ZviFw5pB39C4vd_kK4n7D_jD4vdnjEwie_1Eg2dviFoqcv7Fwwc3xSw_zC_1E4gYv-B4-Jn1FwxjBvwD4kb3S42D_YogI_8DwsyB_xB48tBAo3sBgyB4l0CgZo9kBA40OoGopV3SwunBvlBgofn4Bw_hB3kC4shBv3CgzhBv3Co4a_8DongB3vEw0fvwDg8V_xBglKn1F4zgBv8M4p-BviFowUv_Io5hBngIoqcv7F4xS3oF4tP_9Kojdv4J45Y3oFwjMvgQ43jB_kKopV_7V4xrBvpdwt5B36fohhCnsRg3kBn0X421B_yIgjVngIowU3hGozQ36GwrSvnPo-rBnyJo1e_zP4v2Bv0GomZviFowUv0G4vd_5Hg-jBn1Foqc32Dw2U_8D4uW_yI4h4BnyJopnC_jD4kb_jDgnYn8EgpmB3rBwxKnnHgh5BnjE42cnjE4gY3oF42cv7Fw3b3vEwkT_gHw-annH4yZ_jD4-Jv-BouGviFozQvxKwie3zH4jUnzQ4_pB_3So7vB_yI4gY33Kw_hB_8Do2M3sIwie_nGgyan8E4qTnfg9Dn8Ew6X3hGoghB3zH45xBnrK46xC3kCowUv7Fo56BviFwzqC3S4zHvMo5InxCwvuBvMgwMnGoqD_qC49tCvlBgyzBvlBwy8C_Y46fnG4xSv-BwhiDnfwlavlBwhXv3Cg3kB3kC4uW3rBw8MnxC4jUv-BgpN_qCg7O3vEoqc_jD44RvwDwyRnqDw5Q3vE4jUnoOowmCv7F46fn4BorKv3CosR_1E43jBn8EgjuB3kCgof3rBgve_Yw7enGo9kBwMw8MAgrCwMozQ4SwrSgyB47mBgyB4uW42Do-rBgkDojdwwDw3bw7FwnoBojEwzYo8EwlagvFoqc46GwpdwxKg_qBooOo4zBw2U4qlCw-Bw0G4sI49b44qBolvE41VwvnCwgQg91Bg8uB4h8EotYw7wCohPwlzBgyBwiFg6H4kbo6Pg65BonHw3bgoG4rao5IwjlBw_IosqBo1Fw7eoqDg4S4rB4zHgyB4lJgkDoiW4oFwksB4kCg1Ww3CoufwlBwkTwMglKgZwpdoGw5QnGoonBnfw-a3So9Lv-Bo8d_qCwla_qCg1W_jDwsZn4Bo9Lnf46G3zHgmqB3hG4vd_gHwpdnuG4yZviF4xS_gHg1Wn5I4kbvjMgljBvmIo7W3-0CwwkH3rB42DvtHgxT_qCw7F32Dw4J_qCouG3-iBwvgD3oFwgQv_Io8dvnPw30B3-Jw1mB39Co9L_2Lox0BnuGg6gBv7Fw0f36Go6oB3sIgigCnxCg4SnqD4shBv3C46fnf4wLvlBohP3Sw4JvMw0GviFgylD39CwsyB_qCgzhB_jDo5hB32Dw0f_xB4pMnjEwie_1E4kb_rJ4rzBnrjB4vzF_rJggyBvwDopVnqDgqU3zHggyB3vE4shBn1FopuBnuGgupCnqDg8uB_qCguwBv-BgxlCvMox0Bofok9BgyB4rzB42Do4-DgZggyBvMomyB_YokkB_xBw9sB_jDog6B32DwovB32D4toB_xBovNnxCg1WvpEw4iB_8Do4anqD48U3oFo8d3sIgmqBv5QwhpC_gH42cnlSotqCnhP47_Bn9Lo_yBnkL4yyB_qCwxKv5QouxC_2Lgl8BnjEwoW33K438B3lJoj2BnrKohhC_rJov_B3sIw47Bv_IwooCv3CguXnjE4plBv3CwsZn4BosR3hGo0pC3kCwxjB3rBg6gBv-Bo4sCAg3kBwMwlzBoGgzIwMg3LwMw8Mw-BwvuBouGoxmDo5IoorEghHgluDw_Iw4mEw7Fo23CgyBw-agZo9Lofg_R4SozQoGozQnG43K3So3T3rBgxT3kCwrS_jDwvVnjEo7WnqDg7OvpEw5Q39CglKvtHoiW_5Hw2Un5IwkTnuG4pM3-J4_Q_yIgpNv-BoxCvgQw9TvjMgwM3sI4zH3hGg2E36Go8E36G4vE_nG42Dv_IojEngI49CnyJgkDn5IoxC3mQoqDvgQw3C_qbo8EvwD4Sv2mCovN3imBonHvmIw-Bn6PwiF3wL4vEn9Lw7F_jDgyB3hGg9D3zHwiFv4JonHvyRooO3zH4zHvuO4tP_nGwtH_nGogIv0Gw_IvtH43KngIo2Mv4JozQnrKw9T_nG4iN3hG47NngIgxT39C4sIvpEo2Mn8Eg7O3vEwnP_rJg6gB3zHo4an8Eg7O_1Eo2M_jDwmInnH4mQ_xB42D_rJo3T3tPghgBv1N49bnzQw_hB_jDgoGv-BwpE3lJ48UvwDwmIvtHgqU_nGowUv7Fg1WnxCokLv-B43K_qCgwMv-BgpN_qCo3Tn4Bg1W_Y4pMnGokLnG4qTwMgmRgZo6P4rBwyRw-Bw5QgZgoGw-BovNw-B4iNo4BglKgoGovmBojEg5ZgyBglKoqD4jUg5ZwvyEg-Kog6Bg-Kou4BghH4-iBwzYo33DosRwpvCg9D44RguXo_kDg7O4p-BwuOo56BoiWok2C4-J4plBosRg7gCotYo23Cw0Gg1WorK43jBwnPo4zBg1WotqCw8Mo6oB4iNw5pBongBg1hD40Og4rB4jUog6Bg_RwlzBorK4vd44R4nwBgvFwuOwjMg6gBoghBg-1Co9L4oew4J4gYofw3CgwMw7e46GgmRw-Bo8E4pMoufo8Eo2M4jUoq1BooOohoBorKgve49Cw_Iw3CogIw8MosqB40OomyBwiFo-SgrC4sIoxCoyJgkD4pM49Cg3Lw0Ggrbo4BogIgoGo4awxK45xBwpE41VgrCg3L4lJo_yB46Gg7nB42DgnY46GgjuBojE4kbo1FozpB49CowUo4Bo2MwwDgrbw7Fo-rBw-Bo6Po4Bw1No4BgiO4pMow_Cg3Lo66C46G490BogIov_BglK4vvCgsJgqmCo5I4qlCouGomyBogIw8-BwgQot8Dg3Lgm8Cw0GgyzBojEongBg2EwxjBonHw04B4iNo4lDwtHgz6BgpN42nDovN4opDwxKogzCg6Ho99Bw_Iw9lCghH421BgwM4niDwxKo5zCgoG4yyB4zHolkCw3Cw3bgrCg2d4rBo7WwMg2Ew-BoufwlBguXwMwnPoG4zH4S4mQgZwjlBoGw0GnGorK3SozQ_YokLvlB4wL3rBwqLnfwxKnfooOvMgiOoGgzhBvMo2Mv-Bw3b39C4yZ3kCwkTv7F4rzBv3CoqcvMgoGv-Bo8d_Y48UnGg6H3Sw-aAg5Z4rB45xBwlBgxTgyBolSoxCw-awwD46foxCo-SgoGgpmB4hG4oewwDwnPwtHo8d4sIg2d49Co5IgvFo6Pg-K4vd49Cg6Hg6H4xSw1No8do8EokLonHo6PouG40OojEgzIwqkBgvwCohoBov4Co5I48UwpEg-KgsJgrb4vEgiOwwDwjMwpE4mQoqDw1NgkDgiOw3CwuOoxCgiO49C4xSgrC44RgsJos8CwkTg_gGwwDg4rBgyBw5pBwMgs0CwM4xiNoGw3tCAgoqDwMwjMoGo9LofopV4rBowU4vEgh5BogI4uhDoqDg0oB4Sw0GwlB47NgkD4imBw4J484D4nX4s7I4iN4-_Eofo9LoqDgyzBgZ4xSgrCgx-C4rBo5hBgZokLofg-Kw-B45Y4kCo3ToqDwlag9D4yZwwDopVonHg3kBwpE4qT4hGotYouGgnY4hGw2UgvFwyRo5IwsZglKgyagzIowUgtQ4wkBw_I4xSo2lBg2vCogIg_RgpN4hf41Vg91BozQowtBg0PgqtB4sIwlawuOwhwBokLwnoBgoG4uW4sI4vdozQgs7B4oF4xSgqU41nCo5I4zgB4plB4lmE4vEw5QgzI4hfw4J4imBg6Hw_hBokLo4zBgsJ4nwBwiF42cwiFgof42DwhXgsJou4BwM4kCoyJw_6B4vE4yZ4rBw0Gw0GoqcoqDo2MwwDwjMg9Do9LojEokLwpEwxKgzIw9TorKw9To8E4sIg6HgwMwtHorKwmI43Ko2MohP48UwhXw_IwxKo5Ig-K4tPowU43KgtQwgQwwcg2EoyJgvF4wLglKo0XojE43Kw4J49bonHgnY4oFgxTouGggZw3Co9LoqDovNolrBgutFwxK44qBogIw7ewmIoxbwmI45YgvFwuO46GgtQw0Gg7Og7OojdogIw1NgiO41Vw4JgpN4lJ4wLo5I4-J4lJoyJg6HonHw_IogI4-JogIovNgsJgsJo1FwnPo5Ig_Rw4JwsZooO4oF49Cw3bwnP4_Qw4JgiOgzIogIgvFgzIw0G4zHgoGozQo6P4wLgwMwtHgsJ4oF46GgzIo9LoqDo8E4zH4pM4vE4zHglKg_RwxKowUgwMwsZo1F4pMovNo1eo8E4pMg2Eg-K4iN4liBgoGosRo9L43jB4hGwkTwxKwqkBo1F41V4oFw2UouGw-ag-Kw-zBwwDg_Ro5Io0wBo8Eg9cg2Eg9c4sIw73BghH490BgoGgr0B4sIo1wCg9D4xrBg2Egw-Bg9DgmjCoqDo4sCoxC464Bw3CotxB4kCw0f4kCwlaoqDokkBw3CwzYoqDgkcg2E4-iBwtHg1vB42Dg8Vo1Fo1e4zH4imB4zH4-iBouGgkc46G4kbghHo_ZgzIoufgzIoqcg7Og8uBgzI45YoyJwlawpEokLojEokLosRwrrBg3Lo4a4zHosRwmIwyR4sIosRg7Og2d40O4kbw8MwhX4-J4_QwgQo_ZgxsBg_jCgwM4qTwnPgnYwuOotYgwMwhX4iNo_ZgwMo4a4-Jo7WorKwsZohPg0oBghHw2Uw7FwrS4hGgxTwiF44Rw_IgzhBwpEgmRghHw0fw8Mwj-BgoGgzhB4zHwrrB42Dg8V4rBgsJof4hGofghH4rB4lJoyJolkCg3LoxmDgkD4plBw-BwzY4rBgjV4rBwmhBgZw0f3S4k0B_Yw2U_xBw3bv-Bo_Zn4Bg4Sv-Bg4S_qC4xSv0GgqtB3hG4shBvwDosRvmIwqkBviF4jU33KohoBvmIg2d3-Jg7nBn5IoonB3vE4uWv7FoghBnuGwunB3mQ4j4D3kCw1N_8DwzYvmI4jtB3vEg1W_5HwqkBv8Mwi3B_oN4v2Bn2Mgr0Bv7Fg5Z3vE41VvwDgtQ_uFoxbv0G4-iB_uFw7eviFw7en5Iwm6BviF40nB3zHwugC32D4imB39Cw4iB_1EoziC39C4s6Bn4B4_pB_qC4szC_Y4gxBnGo8oDgyBwk-C4kC4thCwwDwpvCgrCwyqB42D4z5Bw0Ggl1C4oFw73Bw3CwieoqDw7ewtHwj-B4vEoyiBwiF4-iBg2E4oe4oFgof4oFojdggZ49_DwiFoxbwwDowUg9D4nXg9DwlagvFg7nB4oFwhwBw-B4jUwwDwrrBogIo4-Dw-B4rag9D4mpB4vEg-jBonHo7vBwvVwz8DwmIgyzBg6Hwi3Bg9D4zgBgkDg9cw3Cwpd4kCoxbw-Bg9cgyB42cofwzYof4qsBoGo1enGw0f3rBo_yB39Cg22B_qC4shB3kCwzY_jDo1e3iN4j4D3SgvFvlBwqL_Y4sIvwDwmhBnjEg_qBviFwm6Bv3Cw4iBvMojEnGoxC3oF49tCv3CgjuBv-BovmB3SgwM_Y44RnxCgmjC_Yo4a3Sw5Qv-Boz7CnG4miCwMongBo4Bgs7B4So2Mo4B42cw-B4nXofw_Io4BwrSw0Gog6BoqDgkcojEwyqBwlBwnP4rBo4awlBgjuBA4-JnG40On4Bg0oB3rBozQnjEo-rBv3CowU3vEoqcvwDo3T3sI4_pBnjEowU_rJo7vBnxCohPnqD48U_qCwgQ3oFw9sBv3Cw_hB_qCgjuB3SgqUnGglKA4jUofotxB4rBo_ZgyBwvV4kC4gYwiFgxsBoxCg4So8E4vdojE4nXwiFw6Xw7F4ragiO438BogI4wkBgvFg9cojEo0Xg9Dg5Z42DoxbgkDo_Z49Co8dw-B4yZgyBgrbwlBo4awMgxT4Sw-anGwzY3SgnYn4Bg4rB_jDw5pB3kC4uWv1Nop5DnxCo1e3rBw2U3SgiO_Yg1WnGg9c4SgofgZosRgyB4nXw-Bg1WoqDw7eouG4v2Bo4BohPo4Bg7O4oFg1vBgkDgvewpEo_yBg9Dwp2B4S4iNoxC464BgZggZwMoghBoGooO3S4jmCvlBwxjB_xBg8uBv3Cgo4B_nG46jE3kCw73B_xBg39B_YwnoBAohPnG4nX4Sw3tCoGwkTwM4nXoxCw6pC49Cwx8Bg9Dg-8B49C47mBw-B4gY4SgoGwlBw1NogIojvCoqDo8dw4JgrtCokLgrtCgzIox0Bw3bwxgFgzIo_yBghHwrrBgoGo6oBw0G41uBorKw0xC42Dg2dwiFgqtBojEovmBoqDongBw0Gwj-BorK4t6CgvFosqBo8EorjBwiF4liBogIwlzBghHozpBwjMgtiC46G4liBwxKotxBw-BgzI4sIwxjBw0GwlawxKohoBw_Iouf4sIoxbgtQgyzBo2Mw1mBwjMw_hBwqLw0fwwD4-JosqBwk3DghH48Uo9LgwlB49C4-JgZgrCg3Lo3sBgoGo4awpEwkTghHo5hBouGwxjBwlBonHw3ColSg9DwsZgvF4qsBoxC4gYgkDo2lBwlBo6Po4Bo1egyBomyBoGo1enG47mB3kCov8F_xBw3_DvMwovB3Sw0fnfoz7C4SgwlBwlBw8lBw3CgljBwwDo1eo4Bw1NoxC4mQgvFghgBoqDozQ42Dw5Q4vE4xSgoGo0Xg2EozQwiF4mQ43Koufo1FwnPwiFo2Mo8EwqLorKwoW4vEoyJw4Jo-S4vE4sIwtHo2M4sIw1No8EwtHw-BoqDwgQg1W4sIwxKwmIglKo5IglKgsJ4-JwqLwqLglKgsJgmRgiOg0Pg-Kw8Mg6HovNwtHorKwiFguwBwoWwnoBwrSgofooO4hfooOg7OghHw3C4rBgnY43KgtiCo1eosqBwzY4zHgvFonHo1Fg6HouG4sI4zHo2MwjMonHwtH46GwtHovNo6P4iN4_Qo2MolS4pMgxTouGg3Lo5IohP4-JwrSg9D46G49CwiFonH4pMg6H4pM4tP4uW43KgiOw4Jo9LgzIw4Jw_IoyJw_I4lJw_I4sIwjMwxKgoGg2EgwMw_Iw1Nw_Ig6Hg2EohPg6Hw9TgzIg3LojEwnPojEg6Ho4BonHwlBo0XoxCwgQw-B4zHwlB4sI4rBogIo4BogIgrCogIoxCogI49CogIgkDogIwwDo6PwmI4tP4lJ4zHwiFg8Vw5QghH4hGgiOovNwuOohP46Gg6HgpN4mQw8MgmRolSw3bwuO45Yo1FwxKo1FokLghHg7OwwDwtHw4Jg1WovNw4iBgkD4sIwlBgkD4hGwgQgzIwvVgoGooOouGgiO46GgiOonH47N4wLopVg3Lg4Sg-KgtQo9L4mQo9LohP47NwgQ4hGouGw_Io5IwpEwpEwmIonHwtHouG4zH4hGwmIgoG4zH4oFw5QwxK46Gg9D4oeg0PwjMw0Gw0G42DwwDw-BozQw4J43K46G4qTo2MovNoyJw7F4vEg5Zw9Tg-Kw_I4qTozQw4Jo5Io2Mo9Lo1FgvFw4Jw4JwtHwtHw4J4-Jo9Lw8MwkTwvVwiFw7Fw8M4tPwoWgkcokLwuOw8M44RwqL4mQgwM4xSo2M4qTgzIw1NosR42c4lJ4mQ46Go9LwlaoivBwvVo2lB4iNopVwuOo7W43K4mQw1Nw9To2Mg_R42DwiFg4SggZg7O4xSo6PwkTg6gBg7nBgiOwrSwpEgvFwxKooOojEo1FgjVwieojEouGw6Xw1mB47NwhXo9Lw2Ug0P49bo1FwxK4mQoufgjVg4rBw8MoqcoyJoiWwuOoyiBokLg9co5I4nX49CogI4-Jw3b4pM4wkB4iNgtpBwyRog6BgpNo6oBw_I4raw5QopuBo2MghgB4kC4oFgiO4liBgmRginBgsJo3Tg5Zw-zBo6PwtgBoxCo8Eo3TohoBgyBgkDopVwyqBw8Mo_Zo6Pw0f4vEg6Hg9DogIgrC4vEw3Cw7F40nB4vvCwvVo-rBw9T4xrB43K45Yg2EwqL40Og-jBooOgwlBo6Pw9sBg6HguXouGw9TwxKgsiBo1ew7pDoxCo5Io7WwwuCgvFg4So4BgoGwovBovjF4tPwp2Bw1N490Bw4J4mpBojE4xS43K4rzBg2E4gYwmIwvuBwiFwtgBouGo3sBo4Bo2MgrCg4S4kCg_RoxCo7WwpEwksBw3CgzhBgZ4sIgkDowtBo1Fw0qDoGwwD4lJ4guFofozQ4S43KgyBojdw7FgluDoxC4toBoG42D4vEg6yCoxCoivBgZ4qTo4Bg6gB4rBo1ewM4jUAoxbvMoyJn4Bo4a3rBgiOn4Bw1NnxCg0P_8D4jUnjEwyRnqDg3LnjE4iNnjEo9L_5Ho3T_yI4xS3vEo5I_8DghH_rJohP36GoyJ_uFonH32D4vE_kKwqL_hO47N_iVo-SnrKo5I33KogI37N4pM_1Eg9D32DgkD_pUgmR_lRo6P_yIgzIngIo5I_5HgsJ32DwiF_qC49C_uFogInyJohP_qCg2Ev_IosR_1EorKnjEw4JnxCouGnjE4wLnuGw9T32Dw1Nv3C4wLnxCo9L3vEotYnxCwkT3SghHv-B4nXnfg9cwMw2U4SohP4kCg2dgyB40OwqL4_7CwlBorKgyBw8Mw-BgxTw3C4imBwlBwpdoGg5Z_Yg4rBvlBo_Z_jDwvuBv-Bg2d_uF45qC_YoyJ_Y4wL3S4sI_sQw5xHv-BoxbvpEor8BvlB4_Q_qCg-jB39Cg_qB_qCgmqB_Yg4SvMo4aoGgxTAo1F4S4gYgrCoyiB4rBgwMgrCgmRw3Co6PwwDosRojEozQo8EgmRg9DwjMojEwqLojEwxKojEw4J4-Jw2UouG4wLwxKozQg6H43Kw0GogIgoGghHw_Iw_IooOo9LgjVwgQw1NglKgsiB4kb4-JwxKgpNovNgzI4lJgoG4zHouGw_I4hGorKwiFglKwjMgkc42DogIwpEg6Hg2E46GwiFw7FgvF4oF4-Jo5I4lJ4sI4qTosRw_Iw4Jw_IwqLw0GgsJo1FgzIo5IwuOo0XwyqBovNomZw3C4oFw7Fg3LonHo2MgsJgmRo6P42c4sIg0P42DonH40Ooxbg9DonHgrCgkDgsJ4mQ49CwpE49C42D42Dg9Do1FwpEw-BwlBgkD4rB42DwlBg9D4SwwDA42D3S42DvlBwwD_xB42D_qCg9DnqD42D_8DoqDnjEw-B_jDoxC3oFw3Cn5Iw-B3pMw3C_6O4rBnuGwlB3oFwlB_1E42Dv1NwiFn6PgkD3sIgZv-BgrC3hGgwM3vdwpE_rJ4oF_9KgrC3vEoqDv7Fg2E3zH46Gv4J49C32Do8En1FgwM3iNojEvpEoqDnqD46GnuGgrCn4B4hG32DwwDn4Bw-Bnf4oFnxCo1Fv3Cg_R3lJo1F_jDwnPngI47N3zHwwD_xBo8Ev-BgkD_xBo4B_YgvF3kCg9D_YgyBA49C4So4BgZ4kC4rB4zH46G4tP40OwpEojE4kCw-B4zHw0GgkDw3CgoGo1FojEojEwpEwpEg-Kg-KwpEo8EojEo1F42DghH4rBoqDgyBojEgrCwmI4kCo5Iw-Bw8MgyB4-J4SojEgvFw1mBwlBogI4sI4l7Bw7FgtpB4rBogIwlBo8E42Dg3L4vEw4JojE4hGghHghH4oFwwDwlBwM4kCofw-B4Sw7FgZgvFwMoyJwMw7F4So8EwlBojEgyBo1FwwDwwDw3CgZgZwwDn4BnGv3CwMn4BoxCn2M4zHonH4-Jw8M49C4S4vEnxCg6Hn1FgyB_YgZoGgZofo5IghgBgvFosRkpHggP",
          transport: {
            mode: "busRapid",
            name: "FlixBus 621",
            category: "Coach Service",
            color: "#73D700",
            textColor: "#FFFFFF",
            headsign: "Copenhagen Airport",
            shortName: "FlixBus 621",
            longName: "Aalborg - Aarhus - Copenhagen",
          },
          agency: {
            id: "65528_ba99721",
            name: "FlixBus",
            website: "https://global.flixbus.com",
          },
          attributions: [
            {
              id: "d2a3dda55cb717c0cc9a9d085a4e6870",
              href: "https://flixbus.com",
              text: "Information for public transit provided by FlixMobility GmbH",
              type: "disclaimer",
            },
          ],
        },
        {
          id: "R2-S6",
          type: "pedestrian",
          departure: {
            time: "2025-10-01T12:25:00+02:00",
            place: {
              name: "Copenhagen Busterminal",
              type: "station",
              location: {
                lat: 55.66449,
                lng: 12.56091,
              },
              id: "65528_6763",
              code: "KHG",
            },
          },
          arrival: {
            time: "2025-10-01T12:36:00+02:00",
            place: {
              name: "Havneholmen St. (Metro)",
              type: "station",
              location: {
                lat: 55.66091,
                lng: 12.559426,
              },
              id: "17355_22053",
            },
          },
          polyline:
            "BG-5vlqD470-XpX_vBvRz3BjcvmDvCjDvCT_EwC_YkSrOkIrJ7B7fnpBrYjXjI0oBnB0FU4IvC4NoL0yBjDoBjDkDvHoLrEsJzFwHnGwCzIiO",
          transport: {
            mode: "pedestrian",
          },
        },
        {
          id: "R2-S7",
          type: "transit",
          departure: {
            time: "2025-10-01T12:39:00+02:00",
            place: {
              name: "Havneholmen St. (Metro)",
              type: "station",
              location: {
                lat: 55.66091,
                lng: 12.559426,
              },
              id: "17355_22053",
            },
          },
          arrival: {
            time: "2025-10-01T12:43:00+02:00",
            place: {
              name: "Rådhuspladsen St. (Metro)",
              type: "station",
              location: {
                lat: 55.676373,
                lng: 12.568803,
              },
              id: "17355_78697",
            },
          },
          polyline:
            "BHwo30lhB4r1xvH87M_2Qw9JzzNk9HjkHg2J_-H43Fv_D42N71K05K3mL46LnkQ0kIj-Jw5GzuD45Jr-C4qJ4zC4uHkoFoqI8rK8iH0hMwsF8zLs-R4xmB46QwrmBsyI04X8tT8w3BooEsjNomF4yK4mGk4Hk3FwpE41G4_Bo0IgK46Vz6Cs4KwnFotO80SgyQg5Z",
          transport: {
            mode: "subway",
            name: "M4",
            category: "Subway, Metro",
            color: "#0299bb",
            headsign: "Orientkaj St. (Metro)",
            shortName: "M4",
          },
          agency: {
            id: "17355_156091e",
            name: "Metroselskabet",
            website: "https://m.dk",
          },
          attributions: [
            {
              id: "fd99ed0caca491face7b0a55acea971e",
              href: "http://www.rejseplanen.dk",
              text: "With the support of Rejseplanen",
              type: "disclaimer",
            },
          ],
        },
        {
          id: "R2-S8",
          type: "pedestrian",
          departure: {
            time: "2025-10-01T12:43:00+02:00",
            place: {
              name: "Rådhuspladsen St. (Metro)",
              type: "station",
              location: {
                lat: 55.676373,
                lng: 12.568803,
              },
              id: "17355_78697",
            },
          },
          arrival: {
            time: "2025-10-01T12:44:00+02:00",
            place: {
              type: "place",
              location: {
                lat: 55.676704,
                lng: 12.568478,
              },
            },
          },
          polyline: "BG2knmqDm4k_X-EtL4I3S",
          transport: {
            mode: "pedestrian",
          },
        },
      ],
    },
  ];

  const herePlatformAppId = process.env.HERE_PLATFORM_APP_ID;
  const herePlatformApiKey = process.env.HERE_PLATFORM_API_KEY;

  if (!herePlatformAppId || !herePlatformApiKey) {
    throw new Error(
      "HERE_PLATFORM_APP_ID and HERE_PLATFORM_API_KEY must be set"
    );
  }

  // API Docs:
  // https://www.here.com/docs/bundle/intermodal-routing-api-v8-api-reference/page/index.html

  const url = new URL(`https://intermodal.router.hereapi.com/v8/routes`);
  url.searchParams.set("apiKey", herePlatformApiKey!);
  url.searchParams.set("return", "polyline");
  url.searchParams.set("origin", `${start.lat},${start.lng}`);
  url.searchParams.set("destination", `${end.lat},${end.lng}`);
  url.searchParams.set("alternatives", alternatives.toString());

  const response = await fetch(url.toString());
  const data = await response.json();

  if (data.routes.length === 0) {
    throw new Error(data.notices[0]?.message ?? "No routes found");
  }

  // At some point we should probably cast these manually, but for now we'll just return the object as it is
  // These objects are remarkably clean as it is
  return data.routes as HereMultimodalRoute[];
};
