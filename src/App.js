import './App.css';
import { FormSection, Formular, InputDiv, KontrolaButton, MainTitle, PageContainer, SectionTitle, Podekovani } from './AppStyles';
//
import { useReducer, useState, useEffect } from 'react';
// initialState pro useReducer
const defaultObjednavka = {
  typ: '',
  hmotnost: 0,
  doprava: 0,
  bioKvalita: false,
  premiumKvalita: false,
  chudiKvalita: false,
  darkoveBaleni: false,
  rozpocet: 0,
  email: '',
};
// reducer funkce pro useReducer
function setObjednavka(objednavka, action) {
  switch (action.type) {
    case "update_text":
      return { ...objednavka, [action.key]: action.value };
    case "update_number":
      return { ...objednavka, [action.key]: parseFloat(action.value) };
    case "update_bio":
      return { ...objednavka, bioKvalita: !objednavka.bioKvalita };
    case "update_premium":
      return { ...objednavka, premiumKvalita: !objednavka.premiumKvalita };
    case "update_chudi":
      return { ...objednavka, chudiKvalita: !objednavka.chudiKvalita };
    case "update_darek":
      return { ...objednavka, darkoveBaleni: !objednavka.darkoveBaleni };
    default: return objednavka;
  }
}

function App() {
  const [finalPrice, setFinalPrice] = useState(0);
  const [showFinalPrice, setShowFinalPrice] = useState(0);

  const [checked, setChecked] = useState(0);
  const [gift, setGift] = useState(0);

  //state objednavky spravujeme pomoci useReducer hooku
  const [objednavka, dispatch] = useReducer(setObjednavka, defaultObjednavka);

  // useeffect
  useEffect(() => {
    let newFinalPrice = getFinalPrice(objednavka)
    setShowFinalPrice(newFinalPrice);
    let newGiftCheck = checkGift(showFinalPrice);
    setGift(newGiftCheck);
  }, [objednavka, showFinalPrice]);

  const getFinalPrice = (objednavka) => {
    let basePrice = objednavka.hmotnost * objednavka.typ;
    let thisFinalPrice = basePrice;

    if (objednavka.doprava === 250) {
      thisFinalPrice += 250;
    }
    else if (objednavka.doprava === 0.10) {
      thisFinalPrice += (basePrice * 0.10)
    }
    if (objednavka.bioKvalita) { thisFinalPrice += (basePrice * 0.30) }
    if (objednavka.premiumKvalita) { thisFinalPrice += (basePrice * 0.50) }
    if (objednavka.chudiKvalita) { thisFinalPrice -= (basePrice * 0.15) }
    if (objednavka.darkoveBaleni) { thisFinalPrice += 500 }

    setFinalPrice(thisFinalPrice)
    return thisFinalPrice;
  };

  const checkPrice = (objednavka) => {
    if (objednavka.rozpocet >= finalPrice) {
      let checkOK = 1;
      setChecked(checkOK);
    } else {
      let checkNOK = 2;
      setChecked(checkNOK);
    }
  };

  const checkGift = (showFinalPrice) => {
    let checkGiftResult = 0;
    if (showFinalPrice >= 2000) {
      checkGiftResult = 1;
    } else {
      checkGiftResult = 2;
    }
    return checkGiftResult;
  }

  return (
    <PageContainer>
      <Formular>
        <FormSection name="nadpis"><MainTitle>Va??e objedn??vka</MainTitle></FormSection>
        <FormSection name="vyber">
          <SectionTitle>V??b??r krmiva</SectionTitle>
          {/* VYBER TYPU KRMIVA */}
          <label>V??b??r typu krmiva:</label>
          <select id='typ' onClick={(e) => {
            dispatch({
              type: 'update_number',
              value: e.target.value,
              key: 'typ'
            })
          }}>
            <option value={0}>nevybr??no</option>
            <option value={150}>ps?? ??r??dlo 150k??/kg</option>
            <option value={120}>ko??i???? ??r??dlo 120k??/kg</option>
            <option value={50}>??r??dlo pro rybi??ky 50k??/kg</option>
            <option value={800}>??r??dlo pro tygra 800k??/kg</option>
          </select>
          {/* HMOTNOST KRMIVA */}
          <label>Hmotnost krmiva (kg):</label>
          <input type="text" id="hmotnost" value={objednavka.hmotnost} onChange={(e) => {
            dispatch({
              type: "update_number",
              value: e.target.value,
              key: "hmotnost",
            })
          }} />
        </FormSection>
        {/* VLASTNOSTI / EXTRAS */}
        <FormSection name="vlastnosti">
          <SectionTitle>Vlastnosti krmiva</SectionTitle>
          <InputDiv>
            <input type="checkbox" id="bioKvalita" value={0.30} onChange={(e) => {
              dispatch({
                type: "update_bio"
              })
            }} />
            <label>Bio kvalita (+30%)</label>
          </InputDiv>
          <InputDiv>
            <input type="checkbox" id="premiumKvalita" value={0.50} onChange={(e) => {
              dispatch({
                type: "update_premium"
              })
            }} />
            <label>Extra pr??mium kvalita (+50%)</label>
          </InputDiv>
          <InputDiv>
            <input type="checkbox" id="chudaKvalita" value={0.15} onChange={(e) => {
              dispatch({
                type: "update_chudi"
              })
            }} />
            <label>Extra nekvalitn?? pro chud?? (-15%)</label>
          </InputDiv>
          <InputDiv>
            <input type="checkbox" id="darkoveBaleni" value={500} onChange={(e) => {
              dispatch({
                type: "update_darek"
              })
            }} />
            <label>D??rkov?? balen?? (+500k??)</label>
          </InputDiv>
        </FormSection>
        <FormSection name="doprava">
          {/* DOPRAVA */}
          <SectionTitle>Doprava</SectionTitle>
          <div>
            <InputDiv>
              <input type="radio" name="doprava" id="dopravaOdber" value={0} onChange={(e) => {
                dispatch({
                  type: "update_number",
                  value: e.target.value,
                  key: "doprava",
                })
              }} />
              <label>osobn?? odb??r (zdarma)</label>
            </InputDiv>
            <InputDiv>
              <input type="radio" name="doprava" id="dopravaFiremniKuryr" value={0.10} onChange={(e) => {
                dispatch({
                  type: "update_number",
                  value: e.target.value,
                  key: "doprava",
                })
              }} />
              <label>firemn?? kur??r (+10%)</label>
            </InputDiv>
            <InputDiv>
              <input type="radio" name="doprava" id="dopravaCeskaPosta" value={250} onChange={(e) => {
                dispatch({
                  type: "update_number",
                  value: e.target.value,
                  key: "doprava",
                })
              }} />
              <label>??esk?? Po??ta (+250k??)</label>
            </InputDiv>
          </div>
        </FormSection>
        <FormSection name="kalkulace">
          {/* FINALNI CENA - ZOBRAZENI + ROZPOCET */}
          <SectionTitle>Kone??n?? kalkulace</SectionTitle>
          <label>Zadejte v???? rozpo??et:</label>
          <input type="text" id="rozpocet" value={objednavka.rozpocet} onChange={(e) => {
            dispatch({
              type: "update_number",
              value: e.target.value,
              key: "rozpocet",
            })
          }} />
          <label>Fin??ln?? cena:</label>
          <input type="text" id="finalniCena" value={showFinalPrice} disabled />
          {/* BUTTON PRO KONTROLU */}

          <KontrolaButton checked={checked} onClick={() => {
            checkPrice(objednavka);
            console.log(checked);


          }}>
            Kontrola
          </KontrolaButton>
          <Podekovani checked={gift}>
            <b>D??KUJEME ZA OBJEDN??VKU V HODNOT?? NAD 2000K??!</b>
            <p>K objedn??vce V??m p??ibal??me mal?? d??rek.</p>
          </Podekovani>
        </FormSection>
        <FormSection name="email">
          <SectionTitle>Kontaktn?? ??daje</SectionTitle>
          <label>Zadejte va??i emailovou adresu</label>
          <input type="text" id="email" value={objednavka.email} onChange={(e) => {
            dispatch({
              type: "update_text",
              value: e.target.value,
              key: "email"
            })
          }} />
        </FormSection>
      </Formular>
    </PageContainer>
  );
};
export default App;