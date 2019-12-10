
var winactFrameBackgroundColor	 	= "rgba(100,180,100,0.5)";
var winactFrameBorderColor		 	= "rgba(100,180,100,0.5)";
var winactTitleBarColor			 	= "rgba(100,180,100,0.5)";
var winactTitleTextColor			= "#202020";
var winactClientAreaBorderColor	 	= "rgba(100,180,100,0.5)";
var winactClientAreaScrollbarColor	= "";
var winactButtonsImage			 	= "../img/close_icon.png";
var wactFrameBackgroundColor		= "rgba(100,215,100,0.7)";
var wactFrameBorderColor			= "rgba(100,215,100,0.7)"; 
var wactTitleBarColor				= "rgba(100,215,100,0.7)";
var wactTitleTextColor			 	= "#202020";
var wactClientAreaBorderColor		= "rgba(100,215,100,0.7)";
var wactClientAreaScrollbarColor	= "../img/close_icon.png";

IOs=[{
Enable:1,
Type:1,
Flank:1,
shNivel:0,
FailSts:0,
TimeOut:10,
neg:0,
},]

GlobalParms={
MAC:"00-00-00-A8-00-A1",
ETH0:"192.168.0.161",
NETMASK0:"255.255.255.0",
DGW:"192.168.0.1",
MACDGW:"FF-FF-FF-FF-FF-FF",
MODEL:"GW2M4FT",
LOG:"1",
Flashing:"1",
FlasCA:50,
Loops:0,
Inputs:0,
Outputs:0,
Virtual_Inputs:0,
Phases:0,
Virtual_Phases:0,
Groups_Phases:0,
Controllers:1,
Time_Out_Electrical_Error:120,
Time_Out_Consumption_Error:250,
Alert_Over_Voltage:1600,
Normal_Voltage:1200,
Error_Minimal_Voltage:1100,
Error_Critical_Voltage:1050,
Web_Access_Code_RW:"12345",
Web_Access_Code_Ro:"54321",
Time_Zone_GMT:-180,
Enable_GPS:0,
Time_Cap:0,
};

pPLCs=[{
Number:0,
Name:"Anel1",
Plan:"98",
Flashing:"99",
SyncRef:"??/??/????A00:01:00",
Scheduler:"/ag1.sch",
Location:"-34.629331,-58.42561",
Server:"",
Phase1:"0",
ErrorOut:"0",
Svg:"",
Sec:"",
ErrorList:[],
PlanList:[],
Sts:[],
EvFiles:[],
HolyDays:"",
WeekDays:"",
TimeScheduler:"",
}];

OptFrcPln=[0,"Insolado",99,"Flashing",97,"Lamp Off",1,"Plan1()",2,"Plan2(=Plan1+ExV)",3,"Plan3(=Plan1+ExC)",4,"Plan4()",5,"Plan5(=Plan4+ExV)",6,"Plan6(=Plan4+ExC)",7,"Plan7()",8,"Plan8(=Plan7+ExV)",9,"Plan9(=Plan7+ExC)",10,"Plan10()",11,"Plan11(=Plan10+ExV)",12,"Plan12(=Plan10+ExC)",13,"Plan13()",14,"Plan14(=Plan13+ExV)",15,"Plan15(=Plan13+ExC)",16,"Plan16()",17,"Plan17(=Plan16+ExV)",18,"Plan18(=Plan16+ExC)",19,"Plan19()",20,"Plan20(=Plan19+ExV)",21,"Plan21(=Plan19+ExC)",22,"Plan22()",23,"Plan23(=Plan22+ExV)",24,"Plan24(=Plan22+ExC)"];
//---------------------------------------------------
//OptAddSrc=["Local Hd RT","Local Hd RT","Local Hd Fx","Local Hd Fx","Remote Controler","Remote Controler"]		
OptAddSrc=["Local Hd GW1Fx","Local Hd GW1","Local Hd GW2Fx","Local Hd GW2","Local Hd GW3RT","Local Hd GW3","Local Hd GW4RT","Local Hd GW4","Remote Controler","Remote Controler"];
OptInputV=[0,"0",1,"1"];
OptInputFlk=[0,"Count in 0",1,"Count in 1"];
//OptInputShin=[0,(Str_start_up_nivel+" 0"),1,(Str_start_up_nivel+" 1")];
OptSyncClock=[3,"Clock +3",2,"Clock +2",1,"Clock +1",0,"Clock +0"];
//OptControllers=["1","1 "+Str_Controllers+"","2","2 "+Str_Controllers2+"","3","3 "+Str_Controllers2+"","4","4 "+Str_Controllers2+""];
OptMpt3=["2","1 MPT3","4","2 MPT3","6","3 MPT3","8","4 MPT3","10","5 MPT3","12","6 MPT3"];
OptMpt4=["2","1 MPT4","4","2 MPT4","6","3 MPT4","8","4 MPT4","10","5 MPT4","12","6 MPT4","14","7 MPT4","16","8 MPT4"];
OptMpt5=["4","1 MPT","8","2 MPT","12","3 MPT","16","4 MPT","20","5 MPT","24","6 MPT"];
OptMDV=["0","0 MDV8","8","1 MDV8","16","2 MDV8"];
OptMDV4=["0","0 MDV4","4","1 MDV4"];
OptFlashingHz=["1","1hz","2","2hz"];
//OptGpsLinks=["0",Str_Disable,"1","Serial 1","2","Serial 2","3","Internal"];
OptLogLinks=["0","Web","1","Serial 1","2","Serial 2","3","Internal"];
OptTimeZone=[-720,"GMT -12:00 Eniwetok, Kwajalein",-660,"GMT -11:00 Midway Island, Samoa",-600,"GMT -10:00 Hawaii",-540,"GMT -09:00 Alaska",-480,"GMT -08:00 Pacific Time US &amp; Canada",-420,"GMT -07:00 Mountain Time US &amp; Canada",-360,"GMT -06:00 Central Time US &amp; Canada, Mexico City",-300,"GMT -05:00 Eastern Time US &amp; Canada, Bogota, Lima",-240,"GMT -04:00 Atlantic Time Canada, Caracas, La Paz",-210,"GMT-03:30 Newfoundland",-180,"GMT -03:00 Brazil, Buenos Aires, Georgetown",-120,"GMT -02:00 Mid-Atlantic",-60,"GMT -01:00 Azores, Cape Verde Islands",0,"GMT 0 Western Europe Time, London, Lisbon, Casablanca",60,"GMT +01:00 Brussels, Copenhagen, Madrid, Paris",120,"GMT +02:00 Kaliningrad, South Africa",180,"GMT +03:00 Baghdad, Riyadh, Moscow, St. Petersburg",210,"GMT +03:30 Tehran",240,"GMT +04:00 Abu Dhabi, Muscat, Baku, Tbilisi",270,"GMT +04:30 Kabul",300,"GMT +05:00 Ekaterinburg, Islamabad, Karachi, Tashkent",330,"GMT +05:30 Bombay, Calcutta, Madras, New Delhi",360,"GMT +06:00 Almaty, Dhaka, Colombo",420,"GMT +07:00 Bangkok, Hanoi, Jakarta",480,"GMT +08:00 Beijing, Perth, Singapore, Hong Kong",540,"GMT +09:00 Tokyo, Seoul, Osaka, Sapporo, Yakutsk",570,"GMT +09:30 Adelaide, Darwin",600,"GMT +10:00 Eastern Australia, Guam, Vladivostok",660,"GMT +11:00 Magadan, Solomon Islands, New Caledonia",720,"GMT +12:00 Auckland, Wellington, Fiji, Kamchatka"];
//---------------------------------------------------
var IntReg=[
{Type:"Int",Nombre:"THIS",Valor:null},
{Type:"Int",Nombre:"HEAP",Valor:null},
{Type:"Int",Nombre:"CPLCS",Valor:null},
{Type:"Int",Nombre:"FPHASES",Valor:null},
{Type:"Int",Nombre:"RPHASES",Valor:null},
{Type:"Int",Nombre:"VPHASES",Valor:null},
{Type:"Int",Nombre:"GPHASES",Valor:null},
{Type:"Int",Nombre:"CLOOPS",Valor:null},
{Type:"Int",Nombre:"VINPUTS",Valor:null},
{Type:"Int",Nombre:"CINPUTS",Valor:null},
{Type:"Int",Nombre:"COUTPUTS",Valor:null},
{Type:"Int",Nombre:"RUN",Valor:null},
{Type:"Int",Nombre:"RTC",Valor:null},
{Type:"Int",Nombre:"VOLT",Valor:null},
{Type:"Int",Nombre:"Temperature",Valor:null},
{Type:"Int",Nombre:"TOLCD",Valor:null},
{Type:"Int",Nombre:"KEY",Valor:null},
{Type:"Int",Nombre:"OPTUI",Valor:null},
{Type:"Bit",Nombre:"debug.opct",Valor:null},
{Type:"Bit",Nombre:"debug.hw",Valor:null},
{Type:"Bit",Nombre:"debug.can",Valor:null},
{Type:"Byt",Nombre:"debug.rtc",Valor:null},
{Type:"Bit",Nombre:"debug.iohw",Valor:null},
{Type:"Bit",Nombre:"debug.plc",Valor:null},
{Type:"Bit",Nombre:"debug.http",Valor:null},
{Type:"Bit",Nombre:"debug.error",Valor:null},
{Type:"Bit",Nombre:"debug.gps",Valor:null}];
