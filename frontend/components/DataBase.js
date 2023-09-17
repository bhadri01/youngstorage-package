"use client";
import React from "react";
import "@/styles/userAccount/services.scss";
import Button from "@/components/button";
import Dropdown from "@/components/dropdown";
import { useState } from "react";
import { Toast } from "./alert";
import { API } from "@/api/api";
import { GetCreatedTime } from "@/app/[username]/networks/page";
import { Typography } from "@mui/material";


export default function page({ params, servicesUser, service }) {
  console.log("service user:", servicesUser.data?.data?.data);
  let dbusers = servicesUser.data?.data?.data;
  if (dbusers?.dbusers?.length > 0) {
    let options = dbusers?.dbusers?.map((a) => ({
      label: a?.username,
      value: a?.username,
    }));
    const [selectedOption, setSelectedOption] = useState(options[0].value);
    const [selectedCollect, setSelectedCollect] = useState({
      value: "",
      charset: "",
    });
    const [databaseName, setdatabaseName] = useState();
    const CreateDB = async () => {
      console.log(selectedCollect);
      if (selectedOption && selectedCollect.value && selectedCollect.charset && databaseName) {
        let body = {
          username: selectedOption,
          database: databaseName,
          collation: selectedCollect.value,
          charset: selectedCollect.charset,
        };
        await API.addDatabaseToUserService(service.service, body)
          .then((res) => {
            Toast.success(res.data?.message);
            servicesUser.refetch();
            setdatabaseName("");
            setSelectedCollect((a) => ({ value: "", charset: "" }));
          })
          .catch((err) => {
            Toast.error(err.data?.message);
          });
      } else {
        Toast.error("Please fill all the fields");
      }
    };
    const dropDatabase = async (body) => {
      await API.dropDatabaseToUserService(service.service, body)
        .then((res) => {
          Toast.success(res.data?.message);
          servicesUser.refetch();
        })
        .catch((err) => {
          Toast.error(err.data?.message);
        });
    };
    return (
      <div className="database">
        <div className="db-main-container">
          <div className="left">
            <div className="heading">
              <Typography variant="h6" color={'#fff'}>
                Create Database
              </Typography>
            </div>
            <div className="db-container">
              <Typography variant="body1">
                Username
              </Typography>
              <Dropdown
                className="drop"
                options={options}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
              />
            </div>
            <div className="db-container">
              <Typography variant="body1">
                Database Name
              </Typography>
              <div className="db-input">
                <span>{selectedOption}_</span>
                <input
                  type="text"
                  onChange={(e) => setdatabaseName(e.target.value)}
                  value={databaseName}
                />
              </div>
            </div>
            <div className="db-container">
              <Typography variant="body1">
                Collation
              </Typography>
              <CollationOptions
                selectedCollation={selectedCollect}
                setSelectedCollation={setSelectedCollect}
              />
            </div>
            <div className="create">
              <Button
                value="Create Database"
                color="success"
                onClick={CreateDB}
              />
            </div>
          </div>

          <div className="right">
            <div className="heading">

              <Typography variant="h6" color={'#fff'}>
                <b>{service.service}</b> Server Database ({selectedOption} -{" "}
                {dbusers?.dbusers
                  .filter((a) => a.username == selectedOption)
                  ?.map((a) => a.currentNames)}{" "}
                /{" "}
                {dbusers?.dbusers
                  .filter((a) => a.username == selectedOption)
                  ?.map((a) => a.maxNames)}
                )
              </Typography>

            </div>
            <div className="databse-list-for-user">
              {dbusers?.dbusers
                .filter((a) => a.username == selectedOption)
                ?.map((a) =>
                  a.dbNames?.map((names, i) => (
                    <div className="db-user-name-list">
                      <h6>
                        <span>{names?.database}</span>
                        {DataBaseDropBox(dropDatabase, a, names)}
                      </h6>
                      <div className="db-list-lables">
                        <b>{names?.charset}</b>
                        <b>{names?.collation}</b>
                        <i>{GetCreatedTime(names?.createdAt)}</i>
                      </div>
                    </div>
                  ))
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <>
    <Typography variant="h4" style={{
      display: 'flex'
    }} className='user-message'>
      There is no users.Please create a user to add database
    </Typography >
  </>;
}

const CollationOptions = ({ selectedCollation, setSelectedCollation }) => {
  const handleCollationChange = (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const selectedOptgroupLabel = selectedOption.parentNode.label;
    setSelectedCollation({
      value: event.target.value,
      charset: selectedOptgroupLabel,
    });
  };
  return (
    <select
      name="collation"
      className="collation-select"
      onChange={handleCollationChange}
      value={selectedCollation.value}
    >
      <option value="">(collation)</option>
      <optgroup label="armscii8">
        <option>armscii8_bin</option>
        <option>armscii8_general_ci</option>
      </optgroup>
      <optgroup label="ascii">
        <option>ascii_bin</option>
        <option>ascii_general_ci</option>
      </optgroup>
      <optgroup label="big5">
        <option>big5_bin</option>
        <option>big5_chinese_ci</option>
      </optgroup>
      <optgroup label="binary">
        <option>binary</option>
      </optgroup>
      <optgroup label="cp1250">
        <option>cp1250_bin</option>
        <option>cp1250_croatian_ci</option>
        <option>cp1250_czech_cs</option>
        <option>cp1250_general_ci</option>
        <option>cp1250_polish_ci</option>
      </optgroup>
      <optgroup label="cp1251">
        <option>cp1251_bin</option>
        <option>cp1251_bulgarian_ci</option>
        <option>cp1251_general_ci</option>
        <option>cp1251_general_cs</option>
        <option>cp1251_ukrainian_ci</option>
      </optgroup>
      <optgroup label="cp1256">
        <option>cp1256_bin</option>
        <option>cp1256_general_ci</option>
      </optgroup>
      <optgroup label="cp1257">
        <option>cp1257_bin</option>
        <option>cp1257_general_ci</option>
        <option>cp1257_lithuanian_ci</option>
      </optgroup>
      <optgroup label="cp850">
        <option>cp850_bin</option>
        <option>cp850_general_ci</option>
      </optgroup>
      <optgroup label="cp852">
        <option>cp852_bin</option>
        <option>cp852_general_ci</option>
      </optgroup>
      <optgroup label="cp866">
        <option>cp866_bin</option>
        <option>cp866_general_ci</option>
      </optgroup>
      <optgroup label="cp932">
        <option>cp932_bin</option>
        <option>cp932_japanese_ci</option>
      </optgroup>
      <optgroup label="dec8">
        <option>dec8_bin</option>
        <option>dec8_swedish_ci</option>
      </optgroup>
      <optgroup label="eucjpms">
        <option>eucjpms_bin</option>
        <option>eucjpms_japanese_ci</option>
      </optgroup>
      <optgroup label="euckr">
        <option>euckr_bin</option>
        <option>euckr_korean_ci</option>
      </optgroup>
      <optgroup label="gb18030">
        <option>gb18030_bin</option>
        <option>gb18030_chinese_ci</option>
        <option>gb18030_unicode_520_ci</option>
      </optgroup>
      <optgroup label="gb2312">
        <option>gb2312_bin</option>
        <option>gb2312_chinese_ci</option>
      </optgroup>
      <optgroup label="gbk">
        <option>gbk_bin</option>
        <option>gbk_chinese_ci</option>
      </optgroup>
      <optgroup label="geostd8">
        <option>geostd8_bin</option>
        <option>geostd8_general_ci</option>
      </optgroup>
      <optgroup label="greek">
        <option>greek_bin</option>
        <option>greek_general_ci</option>
      </optgroup>
      <optgroup label="hebrew">
        <option>hebrew_bin</option>
        <option>hebrew_general_ci</option>
      </optgroup>
      <optgroup label="hp8">
        <option>hp8_bin</option>
        <option>hp8_english_ci</option>
      </optgroup>
      <optgroup label="keybcs2">
        <option>keybcs2_bin</option>
        <option>keybcs2_general_ci</option>
      </optgroup>
      <optgroup label="koi8r">
        <option>koi8r_bin</option>
        <option>koi8r_general_ci</option>
      </optgroup>
      <optgroup label="koi8u">
        <option>koi8u_bin</option>
        <option>koi8u_general_ci</option>
      </optgroup>
      <optgroup label="latin1">
        <option>latin1_bin</option>
        <option>latin1_danish_ci</option>
        <option>latin1_general_ci</option>
        <option>latin1_general_cs</option>
        <option>latin1_german1_ci</option>
        <option>latin1_german2_ci</option>
        <option>latin1_spanish_ci</option>
        <option>latin1_swedish_ci</option>
      </optgroup>
      <optgroup label="latin2">
        <option>latin2_bin</option>
        <option>latin2_croatian_ci</option>
        <option>latin2_czech_cs</option>
        <option>latin2_general_ci</option>
        <option>latin2_hungarian_ci</option>
      </optgroup>
      <optgroup label="latin5">
        <option>latin5_bin</option>
        <option>latin5_turkish_ci</option>
      </optgroup>
      <optgroup label="latin7">
        <option>latin7_bin</option>
        <option>latin7_estonian_cs</option>
        <option>latin7_general_ci</option>
        <option>latin7_general_cs</option>
      </optgroup>
      <optgroup label="macce">
        <option>macce_bin</option>
        <option>macce_general_ci</option>
      </optgroup>
      <optgroup label="macroman">
        <option>macroman_bin</option>
        <option>macroman_general_ci</option>
      </optgroup>
      <optgroup label="sjis">
        <option>sjis_bin</option>
        <option>sjis_japanese_ci</option>
      </optgroup>
      <optgroup label="swe7">
        <option>swe7_bin</option>
        <option>swe7_swedish_ci</option>
      </optgroup>
      <optgroup label="tis620">
        <option>tis620_bin</option>
        <option>tis620_thai_ci</option>
      </optgroup>
      <optgroup label="ucs2">
        <option>ucs2_bin</option>
        <option>ucs2_croatian_ci</option>
        <option>ucs2_czech_ci</option>
        <option>ucs2_danish_ci</option>
        <option>ucs2_esperanto_ci</option>
        <option>ucs2_estonian_ci</option>
        <option>ucs2_general_ci</option>
        <option>ucs2_general_mysql500_ci</option>
        <option>ucs2_german2_ci</option>
        <option>ucs2_hungarian_ci</option>
        <option>ucs2_icelandic_ci</option>
        <option>ucs2_latvian_ci</option>
        <option>ucs2_lithuanian_ci</option>
        <option>ucs2_persian_ci</option>
        <option>ucs2_polish_ci</option>
        <option>ucs2_roman_ci</option>
        <option>ucs2_romanian_ci</option>
        <option>ucs2_sinhala_ci</option>
        <option>ucs2_slovak_ci</option>
        <option>ucs2_slovenian_ci</option>
        <option>ucs2_spanish2_ci</option>
        <option>ucs2_spanish_ci</option>
        <option>ucs2_swedish_ci</option>
        <option>ucs2_turkish_ci</option>
        <option>ucs2_unicode_520_ci</option>
        <option>ucs2_unicode_ci</option>
        <option>ucs2_vietnamese_ci</option>
      </optgroup>
      <optgroup label="ujis">
        <option>ujis_bin</option>
        <option>ujis_japanese_ci</option>
      </optgroup>
      <optgroup label="utf16">
        <option>utf16_bin</option>
        <option>utf16_croatian_ci</option>
        <option>utf16_czech_ci</option>
        <option>utf16_danish_ci</option>
        <option>utf16_esperanto_ci</option>
        <option>utf16_estonian_ci</option>
        <option>utf16_general_ci</option>
        <option>utf16_german2_ci</option>
        <option>utf16_hungarian_ci</option>
        <option>utf16_icelandic_ci</option>
        <option>utf16_latvian_ci</option>
        <option>utf16_lithuanian_ci</option>
        <option>utf16_persian_ci</option>
        <option>utf16_polish_ci</option>
        <option>utf16_roman_ci</option>
        <option>utf16_romanian_ci</option>
        <option>utf16_sinhala_ci</option>
        <option>utf16_slovak_ci</option>
        <option>utf16_slovenian_ci</option>
        <option>utf16_spanish2_ci</option>
        <option>utf16_spanish_ci</option>
        <option>utf16_swedish_ci</option>
        <option>utf16_turkish_ci</option>
        <option>utf16_unicode_520_ci</option>
        <option>utf16_unicode_ci</option>
        <option>utf16_vietnamese_ci</option>
      </optgroup>
      <optgroup label="utf16le">
        <option>utf16le_bin</option>
        <option>utf16le_general_ci</option>
      </optgroup>
      <optgroup label="utf32">
        <option>utf32_bin</option>
        <option>utf32_croatian_ci</option>
        <option>utf32_czech_ci</option>
        <option>utf32_danish_ci</option>
        <option>utf32_esperanto_ci</option>
        <option>utf32_estonian_ci</option>
        <option>utf32_general_ci</option>
        <option>utf32_german2_ci</option>
        <option>utf32_hungarian_ci</option>
        <option>utf32_icelandic_ci</option>
        <option>utf32_latvian_ci</option>
        <option>utf32_lithuanian_ci</option>
        <option>utf32_persian_ci</option>
        <option>utf32_polish_ci</option>
        <option>utf32_roman_ci</option>
        <option>utf32_romanian_ci</option>
        <option>utf32_sinhala_ci</option>
        <option>utf32_slovak_ci</option>
        <option>utf32_slovenian_ci</option>
        <option>utf32_spanish2_ci</option>
        <option>utf32_spanish_ci</option>
        <option>utf32_swedish_ci</option>
        <option>utf32_turkish_ci</option>
        <option>utf32_unicode_520_ci</option>
        <option>utf32_unicode_ci</option>
        <option>utf32_vietnamese_ci</option>
      </optgroup>
      <optgroup label="utf8mb3">
        <option>utf8mb3_bin</option>
        <option>utf8mb3_croatian_ci</option>
        <option>utf8mb3_czech_ci</option>
        <option>utf8mb3_danish_ci</option>
        <option>utf8mb3_esperanto_ci</option>
        <option>utf8mb3_estonian_ci</option>
        <option>utf8mb3_general_ci</option>
        <option>utf8mb3_general_mysql500_ci</option>
        <option>utf8mb3_german2_ci</option>
        <option>utf8mb3_hungarian_ci</option>
        <option>utf8mb3_icelandic_ci</option>
        <option>utf8mb3_latvian_ci</option>
        <option>utf8mb3_lithuanian_ci</option>
        <option>utf8mb3_persian_ci</option>
        <option>utf8mb3_polish_ci</option>
        <option>utf8mb3_roman_ci</option>
        <option>utf8mb3_romanian_ci</option>
        <option>utf8mb3_sinhala_ci</option>
        <option>utf8mb3_slovak_ci</option>
        <option>utf8mb3_slovenian_ci</option>
        <option>utf8mb3_spanish2_ci</option>
        <option>utf8mb3_spanish_ci</option>
        <option>utf8mb3_swedish_ci</option>
        <option>utf8mb3_tolower_ci</option>
        <option>utf8mb3_turkish_ci</option>
        <option>utf8mb3_unicode_520_ci</option>
        <option>utf8mb3_unicode_ci</option>
        <option>utf8mb3_vietnamese_ci</option>
      </optgroup>
      <optgroup label="utf8mb4">
        <option>utf8mb4_0900_ai_ci</option>
        <option>utf8mb4_0900_as_ci</option>
        <option>utf8mb4_0900_as_cs</option>
        <option>utf8mb4_0900_bin</option>
        <option>utf8mb4_bg_0900_ai_ci</option>
        <option>utf8mb4_bg_0900_as_cs</option>
        <option>utf8mb4_bin</option>
        <option>utf8mb4_bs_0900_ai_ci</option>
        <option>utf8mb4_bs_0900_as_cs</option>
        <option>utf8mb4_croatian_ci</option>
        <option>utf8mb4_cs_0900_ai_ci</option>
        <option>utf8mb4_cs_0900_as_cs</option>
        <option>utf8mb4_czech_ci</option>
        <option>utf8mb4_da_0900_ai_ci</option>
        <option>utf8mb4_da_0900_as_cs</option>
        <option>utf8mb4_danish_ci</option>
        <option>utf8mb4_de_pb_0900_ai_ci</option>
        <option>utf8mb4_de_pb_0900_as_cs</option>
        <option>utf8mb4_eo_0900_ai_ci</option>
        <option>utf8mb4_eo_0900_as_cs</option>
        <option>utf8mb4_es_0900_ai_ci</option>
        <option>utf8mb4_es_0900_as_cs</option>
        <option>utf8mb4_es_trad_0900_ai_ci</option>
        <option>utf8mb4_es_trad_0900_as_cs</option>
        <option>utf8mb4_esperanto_ci</option>
        <option>utf8mb4_estonian_ci</option>
        <option>utf8mb4_et_0900_ai_ci</option>
        <option>utf8mb4_et_0900_as_cs</option>
        <option>utf8mb4_general_ci</option>
        <option>utf8mb4_german2_ci</option>
        <option>utf8mb4_gl_0900_ai_ci</option>
        <option>utf8mb4_gl_0900_as_cs</option>
        <option>utf8mb4_hr_0900_ai_ci</option>
        <option>utf8mb4_hr_0900_as_cs</option>
        <option>utf8mb4_hu_0900_ai_ci</option>
        <option>utf8mb4_hu_0900_as_cs</option>
        <option>utf8mb4_hungarian_ci</option>
        <option>utf8mb4_icelandic_ci</option>
        <option>utf8mb4_is_0900_ai_ci</option>
        <option>utf8mb4_is_0900_as_cs</option>
        <option>utf8mb4_ja_0900_as_cs</option>
        <option>utf8mb4_ja_0900_as_cs_ks</option>
        <option>utf8mb4_la_0900_ai_ci</option>
        <option>utf8mb4_la_0900_as_cs</option>
        <option>utf8mb4_latvian_ci</option>
        <option>utf8mb4_lithuanian_ci</option>
        <option>utf8mb4_lt_0900_ai_ci</option>
        <option>utf8mb4_lt_0900_as_cs</option>
        <option>utf8mb4_lv_0900_ai_ci</option>
        <option>utf8mb4_lv_0900_as_cs</option>
        <option>utf8mb4_mn_cyrl_0900_ai_ci</option>
        <option>utf8mb4_mn_cyrl_0900_as_cs</option>
        <option>utf8mb4_nb_0900_ai_ci</option>
        <option>utf8mb4_nb_0900_as_cs</option>
        <option>utf8mb4_nn_0900_ai_ci</option>
        <option>utf8mb4_nn_0900_as_cs</option>
        <option>utf8mb4_persian_ci</option>
        <option>utf8mb4_pl_0900_ai_ci</option>
        <option>utf8mb4_pl_0900_as_cs</option>
        <option>utf8mb4_polish_ci</option>
        <option>utf8mb4_ro_0900_ai_ci</option>
        <option>utf8mb4_ro_0900_as_cs</option>
        <option>utf8mb4_roman_ci</option>
        <option>utf8mb4_romanian_ci</option>
        <option>utf8mb4_ru_0900_ai_ci</option>
        <option>utf8mb4_ru_0900_as_cs</option>
        <option>utf8mb4_sinhala_ci</option>
        <option>utf8mb4_sk_0900_ai_ci</option>
        <option>utf8mb4_sk_0900_as_cs</option>
        <option>utf8mb4_sl_0900_ai_ci</option>
        <option>utf8mb4_sl_0900_as_cs</option>
        <option>utf8mb4_slovak_ci</option>
        <option>utf8mb4_slovenian_ci</option>
        <option>utf8mb4_spanish2_ci</option>
        <option>utf8mb4_spanish_ci</option>
        <option>utf8mb4_sr_latn_0900_ai_ci</option>
        <option>utf8mb4_sr_latn_0900_as_cs</option>
        <option>utf8mb4_sv_0900_ai_ci</option>
        <option>utf8mb4_sv_0900_as_cs</option>
        <option>utf8mb4_swedish_ci</option>
        <option>utf8mb4_tr_0900_ai_ci</option>
        <option>utf8mb4_tr_0900_as_cs</option>
        <option>utf8mb4_turkish_ci</option>
        <option>utf8mb4_unicode_520_ci</option>
        <option>utf8mb4_unicode_ci</option>
        <option>utf8mb4_vi_0900_ai_ci</option>
        <option>utf8mb4_vi_0900_as_cs</option>
        <option>utf8mb4_vietnamese_ci</option>
        <option>utf8mb4_zh_0900_as_cs</option>
      </optgroup>
    </select>
  );
};
function DataBaseDropBox(dropDatabase, a, names) {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-trash3"
    viewBox="0 0 16 16"
    onClick={() => dropDatabase({
      username: a.username,
      database: names?.database
        .split("_")
        .splice(1)
        .join("_"),
      collation: names?.collation,
      charset: names?.charset,
    })}
  >
    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
  </svg>;
}

