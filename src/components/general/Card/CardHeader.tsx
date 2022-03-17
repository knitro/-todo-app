import React from 'react';
import { IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonText } from '@ionic/react';
import "./CardHeader.css"

////////////////////////////////////////////////////////
/*Props for CardHeader*/
////////////////////////////////////////////////////////

interface Props {
  title     : string | null | undefined,
  subtitle? : string,
  inverted? : boolean,
  icon?     : string,
  color?    : string,
  rightText?: string,
  crossedOutText? : string,
  isBold?   : boolean,
  isCategoryHeader? : boolean,
}

////////////////////////////////////////////////////////
/*CardHeader*/
////////////////////////////////////////////////////////

const CardHeader: React.FC<Props> = (props : Props) => {

  //////////////////////////////
  /*Variable Initialisation*/
  //////////////////////////////

  const title       : string  = (props.title)     ? (props.title)     : "Unknown";
  const subtitle    : string  = (props.subtitle)  ? (props.subtitle)  : "";
  const isInverted  : boolean = (props.inverted)  ? (props.inverted)  : false;
  const icon        : string  = (props.icon)      ? props.icon        : "";
  const color       : string  = (props.color)     ? props.color       : "";
  const rightText   : string  = (props.rightText) ? props.rightText   : "";
  const crossedOutText  : string  = (props.crossedOutText)  ? props.crossedOutText  : "";
  const isBold      : boolean = (props.isBold) ? props.isBold : false;
  const isCategoryHeader : boolean = (props.isCategoryHeader) ? props.isCategoryHeader : false

  //////////////////////////////
  /*Return*/
  //////////////////////////////

  return (
    <IonCardFormatter color={color} isCategoryHeader={isCategoryHeader}>
      {
        (isInverted)
        ? <div>
          <IonCardSubtitle>{subtitle}</IonCardSubtitle>
          <IonCardTitle>
            {
              (icon !== "")
              ? <div>
                <IonIcon icon={icon}/> 
                &nbsp; {/*Spacing*/}
                <IonText>{title}</IonText>
              </div>
              : <IonText>{title}</IonText>
            }
            {
              (rightText !== "")
              ? <IonText class="rightAligned">{rightText}</IonText>
              : <div></div>
            }
          </IonCardTitle>
        </div>
        : <div>
          <CardTitle title={title} icon={icon} rightText={rightText} crossedOutText={crossedOutText} isBold={isBold}/>
          <IonCardSubtitle>{subtitle}</IonCardSubtitle>
        </div>
      }
    </IonCardFormatter>
  )
}

export default CardHeader

////////////////////////////////////////////////////////
/*Props for IonCardFormatter*/
////////////////////////////////////////////////////////

interface Props_IonCardFormatter {
  isCategoryHeader  : boolean,
  color             : string,
  children          : React.ReactNode,
}

////////////////////////////////////////////////////////
/*IonCardFormatter*/
////////////////////////////////////////////////////////

const IonCardFormatter: React.FC<Props_IonCardFormatter> = (props : Props_IonCardFormatter) => {

  //////////////////////////////
  /*Variable Initialisation*/
  //////////////////////////////

  const isCategoryHeader : boolean = props.isCategoryHeader
  const color : string = props.color
  const children :React.ReactNode = props.children

  //////////////////////////////
  /*Return*/
  //////////////////////////////

  if (isCategoryHeader) {
    return (
      <IonCardHeader color={color} className="cardHeader_categoryHeader">
        {children}
      </IonCardHeader>
    )
  } else {
    return (
      <IonCardHeader color={color}>
        {children}
      </IonCardHeader>
    )
  }
}

////////////////////////////////////////////////////////
/*Supporting Component*/
////////////////////////////////////////////////////////

interface Props_CardTitle {
  title           : string | null | undefined,
  icon?           : string,
  rightText?      : string,
  crossedOutText? : string,
  isBold?         : boolean,
}

const CardTitle: React.FC<Props_CardTitle> = (props : Props_CardTitle) => {

  //////////////////////////////
  /*Variable Initialisation*/
  //////////////////////////////

  const title           : string  = (props.title)           ? (props.title)         : "Unknown";
  const icon            : string  = (props.icon)            ? props.icon            : "";
  const rightText       : string  = (props.rightText)       ? props.rightText       : "";
  const crossedOutText  : string  = (props.crossedOutText)  ? props.crossedOutText  : "";
  const isBold          : boolean = (props.isBold)          ? props.isBold          : false;

  //////////////////////////////
  /*Return*/
  //////////////////////////////

  return (
    <IonCardTitle>
      {
        (icon !== "")
        ? <div>
          <IonIcon className="cardHeader_icon" icon={icon}/> 
          &nbsp; {/*Spacing*/}
          {
            (isBold)
            ? <IonText className="cardHeader_text"><b>{title}</b></IonText>
            : <IonText className="cardHeader_text">{title}</IonText>
          }
          
        </div>
        : <>
          {
            (isBold)
            ? <IonText className="cardHeader_text"><b>{title}</b></IonText>
            : <IonText className="cardHeader_text">{title}</IonText>
          }
          </>
      }
      {
        (crossedOutText !== "")
        ? 
        <>
          <IonText class="rightAligned"> ${rightText}</IonText>
          <IonText class="smallTextRightAligned"><i><s>{"Was: $" + crossedOutText}</s></i>{" Now: "}</IonText>
        </>
        : 
        <>
          {
            (rightText !== "")
            ? <IonText class="rightAligned"> ${rightText}</IonText>
            : <></>
          }
        </>
      }
    </IonCardTitle>
  )
}

