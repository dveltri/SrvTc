function LanguageToES()
{
 Str_Target="Destino";
 Str_Contend="Contiene";
 Str_About_Msg="UTC MSTRAFFIC COSMOS V0.170327";
 Str_Function_Control="Funci&#243;n de Control";
 Str_ListVariables="Lista de Variables";
 Str_Source="Fuente";
 Str_Time_Out="Tiempo de espera";
 Str_Save="Guardar";
 Str_ZoomRange="Rango de Zoom";
 Str_MapItem="&#204;tem de Mapa";
 Str_Model="Modelo";
 Str_Filtro="Filtro";
 Str_Representacion="Representaci&#243;n";
 Str_Type="Tipo";
 Str_Variable="Variable";
 Str_Color="Color";
 Str_VarGroups="Grupos";
 Str_Commands="Comandos";
 Str_Control="Control";
 Str_Reports="Reportes de Alertas";
 Str_VarCtrlGroups="Control de Grupos";
 Str_VarGroupName="Nombre de Grupo";
 Str_VarGroupsList="Lista de Grupos";
 Str_VarGroupsConf="Configuraci&#243;n de Grupos";
 Str_BubleInfos="Informaciones de Burbuja";
 Str_Variables="Variables";
 Str_Ubicacion="Ubicaci&#243;n";
 Str_AlertSelectVar="Debe seleccionar una Variable"
 Str_Controler_RTC="Reloj del Controlador";
 Str_Virtual_Controlers="Controlador Virtual";
 Str_Status_Controllers="Estado de Controladores";
 Str_Plan="Plan";
 Str_Close="Cerrar";
 Str_Phases="Movimientos";
 Str_Drv_Off_Line="Driver Desconectado";
 Str_Date="Fecha";
 Str_Description="Descripci&#243;n";
 Str_Status="Estado";
 Str_Driver="Driver";
 Str_AdminDevice="Admin. Dispositivos";
 Str_ListDevice="Lista de Dispositivos";
 Str_AddDeviceHttp="Agregar Dispositivo(htp)";
 Str_Add="Agregar";
 Str_Ctrl_By_Scheduler="Control por Agenda";
 Str_Scheduler="Agendas";
 Str_AdminScheduler="Admin. Agendas";
 Str_AddSchedulers="Agregar Agenda";
 Str_AddFncSch="Agregar Acci&#243;n de Agenda";
 Str_ModFncSch="Modificar Acci&#243;n de Agenda";
 Str_AddGroup="Agregar Nuevo Grupo";
 Str_ShowSchedulers="Mostrar Agenda";
 Str_ListSchedulers="Lista de Agendas";
 Str_SchedulersFnc="Acciones de Agenda";
 Str_DelSchedulers="Borrar Agenda";
 Str_UpdateGps="Actualizar posici&#243;n en el Mapa?";
 Str_Add_Inputs="Agregar Entrada a la Estad&#237;stica";
 Str_Statistic="Estad&#237;stica";
 Str_StatisticList="Lista Estad&#237;sticas";
 Str_GLDKey="Google API Key";
 Str_Show_Inputs="Mostrar Entradas";
 Str_Del_Inputs="Borrar Entrada";
 Str_Clones_Sch="Verificar y Setear en todos los Controladores";
 Str_Holidays="D&#237;as Festivos";
 mn=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
 Str_New_Time_scheduler="Nuevo agenda de Tiempo";
 Str_DaysName=["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];
 Str_Month="Mes";
 Str_Day="Dia";
 Str_Zoom="Zoom";
 Str_InpSch="Entre el nombre de la Agenda";

 Str_Cruce="Cruce";
 Str_Admin="Admin";
 Str_Location="Ubicacion";
 Str_login="Loguearse";
 Str_Permission="Permisos";
 Str_LTS="Ultimo vez de acceso";
 Str_Email="Email";
 Str_User="User";
 Str_AdminUsers="Admin Usuario";
 Str_New="Nuevo";
 Str_Viewed="Visto";
 Str_Cancel="Cancelar";
 Str_Ident="Identificacion";
 Str_Ident_Des="Identificacion unica e irrepetible en el sistema";
 Str_Controllers="Controlador";
 Str_Centrl_Flow_Ctrl="Diagrama Logico";
 Str_New_Flow_Ctrl="Nuevo Diagrama";
 Str_Edit_Flow_Ctrl="Edit Diagrama";
 Str_List_Flow_Ctrl="Lista de Diagramas";
 Str_Save="Guardar";
 Str_Date="Fecha";
 Str_MN_Config="Configuracion";
 Str_MN_Info="Informacion";
 Str_Print_Info="Imprimir Informacion";
 Str_MN_Tools="Herramientas";
 Str_Serial_Port="Puerto Serial";
 Str_period="periodo";
 Str_Conf_General="Configuracion General";
 Str_Add_Conflict="Agregar Conflicto";
 Str_Matrix="Matris";
 Str_Show_Plans="Lista de Planes";
 Str_Show_Conflicts="Lista de Conflictos";
 Str_Show_Scheduler="Lista de Agendas";
 Str_Lack="perdida";
 Str_Config_Phase="Configuracion de movimiento";
 Str_Config_Comms="Configuracion de Comunicacion";
 Str_Config_Iteris="Configuracion de Iteris";
 Str_Config_OPCT="Configuracion de OPCT";
 Str_AdminInputs="Admin Entradas";
 Str_Config_Inputs="Configuracion Entradas";
 Str_Flow_Program="Programa Diagrama Logico";
 Str_Easy_Program="Easy Program";
 Str_New_scheduler="Nueva Agenda";
 Str_Config_Phases="Configuracion Movimientos";
 Str_Weekly_Table="Tabla de Semana";
 Str_ed_Plan="Editar plan";
 Str_StsVcontrollers="Estado de Cotroladores Virt.";
 Str_Process="Proceso";
 Str_Inputs="Entradas";
 Str_All_Inputs="Todas las Entradas";
 Str_About="Acerca de";
 Str_FilerManager="Administrador de Archivos";
 Str_LogOut="Desloguearse";
 Str_Restart="Reiniciar";
 Str_StartDate="Fecha Inicial";
 Str_EndDate="Fecha final";
 Str_Save_Windows="Guardar Ventanas";
 Str_Orientation="Orientacion";
 Str_Map="Mapa General";
 Str_MapList="Lista de Items de Mapa";
 Str_Debugger="Debugger";
 Str_disable="desabilitar";
 Str_GP_MAC_Address="Direccion MAC:";
 Str_GP_MAC="Especifique la direccion MAC (Media Access Control)";
 Str_GP_ETH_Address="Direccion IP:";
 Str_IP="IP del controlador";
 
 Str_GP_IP="Especifique la direccion IP del controlador";
 Str_GP_Sub_Net_Mask_Address="Sub Net Mask:";
 Str_GP_NMSK="Set the net work sub net mask";
 Str_GP_DGWMAC_Address="Default Gate Way MAC:";
 Str_GP_DGWMAC="Direccion MAC correspondiente al puerta de enlace por descarte (default gate way)";
 Str_GP_Log_Out="Log Link";
 Str_GP_LOG="Especifique el destino de los logs";
 Str_GP_FUT="flashing frequency";
 Str_GP_FUC="Setup flashing frequency in Hz";
 Str_GP_FDT="Cycle Activity";
 Str_GP_FDC="Cycle Activity in %";
 Str_GP_Loops="Loops:";
 Str_CantSamples="Cantidad de Muestas";
 Str_GP_Loops_1="Especifique la cantidad de loops que tiene el sistema";
 Str_GP_Inputs="Imputs:";
 Str_GP_Inputs_1="Especifique la cantidad de inputs adicionales que tiene el sistema";
 Str_GP_Phases="Moviemientos:";
 Str_GP_Phases_1="Especifica la cantidad de Movimiento que Tiene conectadas el controlador";
 Str_GP_PhasesV="Virtual Phase:";
 Str_GP_PhasesV_1="Especifica la cantidad de Movimiento Virtuales del controlador";
 Str_Groups="Groups";
 Str_GP_PhasesG_1="Especifica la cantidad de Movimiento Grupales del controlador";
 Str_GP_Controllers="Controllers:";
 Str_GP_NC="Especifica la cantidad de controladores virtuales";
 Str_GP_TOET="Time Out Electrical Error:";
 Str_GP_TOEC="Especifica el tiempo de espera ante error electricos";
 Str_GP_TOCT="Time Out Consumption Error:";
 Str_GP_TOCC="Especifica el tiempo de espera antes aceptar un error de consumo";
 Str_GP_AOVT="Alerta de Sobre tension:";
 Str_GP_AOVC="Especifica el nivel de tension en que generara la alerta";
 Str_GP_NVT="Normal Voltage:";
 Str_GP_NVTC="Especifica el nivel de tension en que trabajan las lampars";
 Str_GP_EMVT="Error de baja tension:";
 Str_GP_EMVC="Especifica el nivel de baja tension";
 Str_GP_ECVT="Error de tension Critico:";
 Str_GP_ECVC="Especifica el nivel de tension Critico";
 Str_GP_WACTro="Codigo de Accesso Web User:";
 Str_GP_WACT="C&#243;digo de Acesso Web";
 Str_GP_WACTrw="Codigo de Accesso Web Admin:";
 Str_GP_WACC="Especifica Codigo de Accesso Web";
 Str_GP_Time_Capture_Inputs="Time Capture Imputs";
 Str_GP_TCIT="Time to capture inputs in minits";
 Str_GP_GPS_Port="GPS Port";
 Str_GP_GPS_Port_1="Seleccione el puerto en el que se encuentra conectado el GPS"; 
 Str_GP_Time_Zone="Time Zone GMT";
 Str_GP_Time_Force="Tiempo para finalizar la imposicion de plan";
 Str_GP_Time_Zone_1="Seleccione la Zona horaria";
 Str_GP_Save_Conf="Guardar Configuracion Basica";
 Str_Number="Numero";
 Str_Name="Nombre";
 Str_Initial_Plan="Plan Inicial";
 Str_flashing_Plan="Plan Titilante";
 Str_Sync_Ref="Ref. of Sync";
 Str_scheduler="Agenda";
 Str_Server="Server";
 Str_Phase_server="Phase central";
 Str_Output_of_Error="Output of Error";
 Str_Intersection="Interseccion";
 Str_Phase_server="Central Phase";
 Str_Fail_Report="Fail Report";
 Str_Partial_Lack_Red="Partial Lack Red";
 Str_Partial_Lack_Yellow="Partial Lack Yellow";
 Str_Partial_Lack_Green="Partial Lack Green";
 Str_Conflict="Conflict";
 Str_Upload="Cargar";
 Str_Time_Green="Tiempo de Verde";
 Str_Open_Flow="Open flow";
 Str_Close_Flow="Close flow";
 Str_Open="Abrir";
 Str_Delet="Borrar";
 Str_Viewed="Visto";
 Str_filename="Nombre de Archivo";
 Str_Alert_General="Debe abrir el panel de general primero";
 Str_Lack_of_Lamps="Lack of Lamps";
 Str_Power_of_Red_Lamp="Power of Red Lamp";
 Str_Power_of_Yellow_Lamp="Power of Yellow Lamp";
 Str_Power_of_Green_Lamp="Power of Green Lamp";
 Str_Group_Phase="Group Phase";
 Str_Reload_All_Plans="Reload All Plans";
 Str_Baud_Rate="Baud Rate";
 Str_Parity="Parity";
 Str_Data_Bit="Data Bit";
 Str_Stop_Bits="Stop Bits";
 Str_Alert_Get_Comm="please Get Config Comms";
 Str_Iteris_Title="Config Iteris";
 Str_Title="Title";
 Str_Parameter="Parameter";
 Str_Value="Value";
 Str_Refresh_Time="Refresh Time";
 Str_Select_Comm="Select Link";
 Str_OPCT_Parameters="Parameter";
 Str_OPCT_Description="Description";
 Str_Time_to_Normal_Mode="Time to normal mode";
 Str_comm="Comm";
 Str_offset_inputs="offset inputs";
 Str_slave="slave";
 Str_Group="Group";
 Str_Communication_port="Communication port";
 Str_Time_to_change_normal_mode="Time to change normal mode";
 Str_door="Door";
 Str_UPS="UPS";
 Str_Battery="Battery";
 Str_Flashing="Flashing";
 Str_Lamp="Lamp";
 Str_Stp_by_Stp="Stp by Stp";
 Str_Add_Instruction="Agregar Instruccion"
 Str_Add="Agregar";
 Str_Add_Variable="Agregar Variable";
 Str_Add_Function="Agregar funccion";
 Str_Plan_Number="Plan Number";
 Str_GB_Plan_Number="Este debe ser mayor que 0 y menor que 255";
 Str_GB_Plan_Number_1="Introdusca el Numero de Plan";
 Str_Temp_All_Cicle="Temp All Cicle";
 Str_GB_Temp_All_Cicle="Introdusca el Tiempo de Ciclo";
 Str_Discrepancy="Discrepancy";
 Str_GB_Discrepancy="Introdusca el Defazaje";
 Str_Safety_Cycle_Time="Safety Cycle Time";
 Str_GB_Safety_Cycle_Time="Enter the Safety Cycle Time";
 Str_Conflict_File="Conflict File";
 Str_GB_Conflict_File="";
 Str_Qtd_Phase="Moviemientos";
 Str_Number_Phase="Moviemiento";
 Str_GB_Qtd_Phase="";
 Str_Main="Crear Main";
 Str_Name_Stage="Name Of Stage";
 Str_GB_Name_Stage="";
 Str_Type_Stage="Type of Stage";
 Str_GB_Type_Stage="Select one type of stage";
 Str_Stage="Stage";
 Str_Stage_Normal="Normal";
 Str_Stage_EV="Entre Verde";
 Str_Color="Color";
 Str_Off="Apagado";
 Str_Red="Red";
 Str_Yellow="Yellow";
 Str_Green="Green";
 Str_Red_Yellow="Red_Yellow";
 Str_Green_Yellow="Green Yellow";
 Str_no_Change="No Change";
 Str_No_Flashing="No Flashing";
 Str_Flashing= "Flashing";
 Str_Flashing_Compensated="Flashing Compensated";
 Str_Ascendant="ascendant";
 Str_Falling="falling";
 Str_Lights_Out="Lights Out";
 Str_On="On";
 Str_Off="Off";
 Str_Other_Stage="Other Stage";
 Str_Lamp_Off="Lamp Off";
 Str_Service_On="Service On";
 Str_Holidays="Holidays";
 VStr_month=['January','February','March','April','May','June','July','August','September','October','November','December'];
 Str_New_Time_scheduler="New Time scheduler";
 VStr_DaysName=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
 Str_Month="Month";
 Str_Day="Day";
 Str_NewEasy_Program="New Easy Program";
 Str_NewEasy_Plans="Plans";
 Str_NewEasy_InitSeq="Make Init Seq.";
 Str_Est_Time_YellowP="Yellow Blink Time";
 Str_Est_Time_RedT="Red Total Time";
 Str_Red_Total="Total Red";
 Str_Yellow_Blink="Blink Yellow";
 Str_Mov="Move";
 Str_Times="Times";
 Str_Sync="Sync";
 Str_Labels="Labels";
 Str_Condic="Condition";
 Str_Copy="Copy";
 Str_seg = "security";
 Str_flashing_Plan="Flashing Plan";
 Str_logic_state="Transitions";
 Str_ocup="Load";
 Str_restart_plan="Reload plans";
 Str_reload_page="Need to reload the web page";
 Str_Time = "Delay";
 Str_seg = "security";
 Str_extend = "extended";
 Str_maximum = "maximum";
 Str_Comp_Program = "Assembler";
 Str_Plan_Type = "Tipo de plan";
 Str_Force_Plan = "Forzar plan";
 Str_Rest_Plan = "Restaurar plan";
 Str_Sinc = "Sync point";
 Str_board = "Tipo de Placa";
 Str_boardH = "Seleccionar el tipo de Placa";
 Str_FilePlan = "Plans";
 Str_FileConf = "Conflicto";
 Str_FileSch  = "Agenda";
 Str_Files    = "Archivos";
 Str_no_select = "No seleccionado";
 Str_Ocorr     = "Errores";
 Str_Cod_Ocorr = "Codigo de Error";
 Str_Descr_Ocorr = "Informacion de Error";
 Str_DtHr_Ocorr = "Error Date / Hour";
 Str_Day = "Dia";
 Str_Month = "Mes";
 Str_Year = "A~no";
 Str_Seek = "Buscar";
 Str_New_Seek = "New Seek";
 Str_tp_controller = "Controlador tipo => ";
 Str_New_Easy_Seq = "Make init sequence";
 Str_Config_OTU = "Config OTU";							//M�rcio - TESC - 24/06/2013
 Str_Ctrl_OTU   = "Control(Force)";								//M�rcio - TESC - 25/06/2013
 Str_Reply_OTU  = "Reply(Confirm)";
 Str_OTU_Command = "Command";							//M�rcio - TESC - 27/06/2013
 Str_OTU_Demand= "Demand";
 Str_OTU_Menu1 = " IN/OUT Bits";							//M�rcio - TESC - 15/07/2013
 Str_OTU_Menu2 = " Between green";				
 Str_OTU_Menu3 = " Conflict Sequence";
 Str_OTU_CEV = " Colors";								//M�rcio - TESC - 16/07/2013
 Str_Controls = " Controls";
 Str_FO = "Focus off";									//M�rcio - TESC - 02/10/2013
 Str_Manual_CTRL = "Manual Control";
 Str_Excesso = "Excess of";	
 Str_Bord_off = "Lack of board";
 Str_GP_UART0="Especifique la velocidad de comunicacion para el USART 0 Ej.:9600";
 Str_GP_UART1="Especifique la velocidad de comunicacion para el USART 1 Ej.:9600";
 Str_PhaseV="Moviemiento Virtual:";
 Str_PhaseG="Grupo de Moviemientos:";
 Str_Config="Configuracion";
 Str_Info="Informacion";
 Str_Add="Agregar";
 Str_Alerts="Alertas";
 Str_Attrib="Atributos";
 Str_Bit="Bit";
 Str_Byte="Byte";
 Str_Controller="Controller";
 Str_TC_in_Err ="Controller in Err";
 Str_Controller_Number="Controller Number";
 Str_Controller_Status="Controller Status";
 Str_Controllers_Parameters ="Config of Controllers";
 Str_Crit_Voltage="Voltage Critico";
 Str_Capture="Capture";
 Str_Cycle="Cycle";
 Str_Color="Color";
 Str_Code="Codigo";
 Str_Call="Call";
 Str_Close="Cerrar";
 Str_Change="Cambiar";
 Str_Conflict="Conflicto";
 Str_Compile="Compile";
 Str_Description="Descripcion";
 Str_Disable="desabilitado";
 Str_Door="Puerta";
 Str_Delet="Borrar";
 Str_Errors="Errores";
 Str_Error="Error";
 Str_Edit="Editar";
 Str_Electrical="Electrico";
 Str_File="Archivo";
 Str_Function="Funcion";
 Str_Flow="Diagrama Logico";
 Str_Group="Grupo";
 Str_General_Status="Estado General";
 Str_General_Parameters ="Paramatros Generales";
 Str_Green="Verdes";
 Str_Integer="Integer";
 Str_Instruction="Instrucion";
 Str_Phase_Errors_Disable="Disable Phases Errors";
 Str_Time_minimum_Green="Minimun time of green";
 Str_Time_minimum_Red="Minimun time of red";
 Str_Min_Voltage="Low Voltage";
 Str_Last_Time_Green="Last Green";
 Str_Jump_To="Jump to";
 Str_Memory="Memory";
 Str_Mode="Mode";
 Str_minimum="minimum";
 Str_Make="Make";
 Str_Ouputs="Ouputs";
 Str_of="of";
 Str_Partial="Partial";
 Str_Phase="Phase";
 Str_Red="Red";
 Str_language="Language";
 Str_Lamp="Lamp";
 Str_Lack_Red="Lack Red";
 Str_Lack_Yellow="Lack Yellow";
 Str_Lack_Green="Lack Green";
 Str_Err_Electric_Red="Err Electric Red";
 Str_Err_Electric_Yellow="Err Electric yellow ";
 Str_Err_Electric_Green="Err Electric Green";
 Str_Firmware="Firmware";
 Str_Received="Received";
 Str_Rx_id_ok="Received Ok";
 Str_MD_Off="Mode off";
 Str_MD_Error="Mode Error";
 Str_MD_Remote="Mode Remote";
 Str_MD_Manual="Mode Manual";
 Str_MD_Normal="Mode stand-alone";
 Str_MD_Normal_lock="Mode local scheduler";
 Str_New="Nuevo";
 Str_Normal_Voltage="Normal Voltage";
 Str_Output="Ouput";
 Str_Offset="Offset";
 Str_Open="Open";
 Str_Over_Voltage="Over Voltage";
 Str_Phase_Status="Phase Status";
 Str_Port="Port";
 Str_Program="Program";
 Str_Plans="Plans";
 Str_WAITING="WAITING";
 Str_READY="READY";
 Str_DELETED="DELETED";
 Str_WAITING_DATA="WAITING DATA";
 Str_Priority="Prioridad";
 Str_Passwords="Password";
 Str_Power="Power";
 Str_Plan_Editor="Plan editor";
 Str_Transmitted="Transmitted";
 Str_Temperature="Temperature";
 Str_MD_Flashing="Mode Flashing";
 Str_MD_StpByStp="Step by Step Mode";
 Str_Set="Set";
 Str_Size="Size";
 Str_Serial="Serial";
 Str_Short="Short";
 Str_save="Guardar";
 Str_Type="Tipo";
 Str_Task_Name="Nombre de Tarea";
 Str_Time="Tiempo";
 Str_Task_Number="Numero de Tarea";
 Str_Upload="Cargar";
 Str_Vcontrollers="Controlador Virtual";
 Str_Voltage="Voltage";
 Str_Version="Version";
 Str_Variable="Variable";
 Str_Save_Conf="Guardar configuracion";
 Str_Extra_Data="Datos Extras";
 Str_Red="Rojo";
 Str_Yellow="Amarillo";
 Str_Green="Verde";
}
