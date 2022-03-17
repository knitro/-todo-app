import React from 'react';
import { IonCheckbox, IonIcon, IonItem, IonLabel, IonRange, IonSelect, IonSelectOption, IonText } from "@ionic/react";
import { v4 } from 'uuid';
import { convertSnakeToEnglish } from '../../logic/StringHelper/StringHelper';

////////////////////////////////////////////////////////
/*Props and State*/
////////////////////////////////////////////////////////

interface Props {
  icon?           : string,
  header          : string,
  subheader?      : string | null,
  clickFunction?  : () => void,
  largeText?      : boolean,
  options?        : Options,
  optionsMulti?   : OptionsMulti,
  optionsSlider?  : OptionsSlider,
  disabled?       : boolean,
  disableFunction?: (b : boolean) => void,
  disableText?    : string
}

interface Options {
  value   : any, 
  setter  : (s: any) => void, 
  options : any[],
}

interface OptionsMulti {
  value   : any[], 
  setter  : (s: any) => void, 
  options : any[],
}

interface OptionsSlider {
  // setter  : (s: {lower: number, upper: number}) => void, .// This is for range setting
  setter  : (s : number) => void
  min     : number,
  max     : number,
  value   : number,
}

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

/**
 * Creates a Item that is placed in an IonList
 * Note that if any of the options are being used, it will display one of the following in this order {Options, OptionsMulti, OptionsSlider}
 * @param props 
 * @returns 
 */
const ListItem: React.FC<Props> = (props) => {
  
  ////////////////////////
  /*Variables*/
  ////////////////////////

  //Constants
  const blankFunction : () => void = () => {}

  //Props
  const icon = props.icon
  const header = props.header
  const subheader = props.subheader
  const clickFunction = (props.clickFunction) ? props.clickFunction : blankFunction
  const largeText = (props.largeText) ? props.largeText : false
  const options = props.options
  const optionsMulti = props.optionsMulti
  const optionsSlider = props.optionsSlider
  const disabled = (props.disabled) ? props.disabled : false
  const disableFunction = (props.disableFunction) ? props.disableFunction : (b: boolean) => {}
  const disableText = (props.disableText) ? props.disableText : "Disable"

  // Generated from Props
  const textHeaderClass = (largeText) ? "labelHeader" : ""
  const subHeaderClass = (largeText) ? "belowHeaderText" : ""
  const topItemLines = (props.disableFunction) ? "none" : "full"
  
  ////////////////////////
  /*Return*/
  ////////////////////////

  return (
    <>
      <IonItem onClick={clickFunction} lines={topItemLines}>
        {
          (icon)
          ? <>
              <IonIcon icon={icon} color="primary" />
              &nbsp; &nbsp; &nbsp; {/*Spacing*/}
            </>
          : <></>
        }
        <IonLabel>
          <IonText class={textHeaderClass}>{header}</IonText>
          <br/>
          {
            (subheader !== undefined)
            ? (subheader !== null)
              ? <>
                  <IonText class={subHeaderClass}>{subheader}</IonText>
                  <br/>
                </>
              : <>
                  <IonText class={subHeaderClass}>{header + "not available"}</IonText>
                  <br/>
                </>
            : <></>
          }
        </IonLabel>
        {
          (options)
          ? <IonSelect value={options.value} onIonChange={e => options.setter(e.detail.value)} disabled={disabled}>
              {
                options.options.map((currentOption : any) => 
                  <IonSelectOption key={v4()} value={currentOption}>{convertSnakeToEnglish(currentOption.toString())}</IonSelectOption>
                )
              }
            </IonSelect>
          : (optionsMulti)
          ? <IonSelect value={optionsMulti.value} multiple={true} onIonChange={e => optionsMulti.setter(e.detail.value)} disabled={disabled}>
              {
                optionsMulti.options.map((currentOption : any) => 
                  <IonSelectOption key={v4()} value={currentOption.toString()}>{convertSnakeToEnglish(currentOption.toString())}</IonSelectOption>
                )
              }
            </IonSelect>
          : (optionsSlider)
          ? <IonRange
              min={optionsSlider.min} max={optionsSlider.max} value={optionsSlider.value}
              onIonChange={e => optionsSlider.setter(e.detail.value as any)}
              color="secondary" pin snaps step={1}
              disabled={disabled} 
              // dualKnobs
            >
              <IonLabel slot="start">{optionsSlider.min}km</IonLabel>
              <IonLabel slot="end">{optionsSlider.max}km</IonLabel>
            </IonRange>
          : <></>
          
        }
      </IonItem>
      {
          (props.disableFunction)
          ? <IonItem>
              <IonLabel slot="end">{disableText}</IonLabel>
              <IonCheckbox slot="end" checked={disabled} onIonChange={(e) => disableFunction(e.detail.checked)}/>
            </IonItem>
          : <></>
        }
    </>
  );
};

export default ListItem;