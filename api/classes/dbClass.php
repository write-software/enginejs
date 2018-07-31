<?php
//---------------------------------------------------------------------------------------
/*
	Name	:	Generic Database Class
	Author	:	S. Egginton
	Created	:	01/2009
	
	Description
	
	This class is designed to create the HTML for show the criteria of a report.
	


*/
//---------------------------------------------------------------------------------------
class dbClass
{
 	public	$dbconn = null;
 	public	$dbtype;
 	public	$dbname;
 	public	$result = null;
 	public  $row = null;
 	public  $db = null;
 	public 	$dbh;
 	public 	$affected = 0;
 	public  $err = "";
 	
 	function connect($type, $dbhost, $dbname, $dbuser, $dbpass)
 	{
 		try
 		{
			$this->dbtype = strtolower($type);
			$this->dbname = strtolower($dbname);
 			if ($type == "mssql")
 			{				
				$this->dbconn = mssql_connect($dbhost, $dbuser, $dbpass);
				if ($dbname != "")
				{
					$this->db = mssql_select_db($dbname, $this->dbconn);
				}
 			}
			else if ($type == "mysql")
			{
			    $pos = strpos($dbhost,":");
			    if ($pos !== false)
			    {
			        $port = substr($dbhost,$pos+1);
			        $dbhost = substr($dbhost,0,$pos);
				    $this->dbconn = mysqli_connect($dbhost, $dbuser, $dbpass,$dbname,$port);
                }
                else
				    $this->dbconn = mysqli_connect($dbhost, $dbuser, $dbpass);
				if ($dbname != "")
				{
					$this->db = mysqli_select_db($this->dbconn, $dbname);
					$this->query("SET NAMES 'utf8'");
				}
			}
			else if ($type == "sqlite")
			{
				$this->db = new SQLiteDatabase($dbhost);
			}
			else
			{
				return false;		
			}
			if ($dbname == "" && $type != "sqlite")
			{
				if (!$this->dbconn)
				{
					return false;
				}					
			}
			else if(!$this->db)
			{
				return false;			
			}
 		}
 		catch (Exception $e)
 		{
			return false;			 			
 		}
		return true;
	}
	
	function getTypeCode($type)
	{
		if (stripos($type,"varchar") >= 0)
		{
			return 200;
		}
		if (stripos($type,"int") >= 0)
		{
			return 2;
		}
		if (stripos($type,"date") >= 0)
		{
			return 7;
		}
		if (stripos($type,"numeric") >= 0)
		{
			return 131;
		}
		if (stripos($type,"double") >= 0)
		{
			return 5;
		}
		if (stripos($type,"currency") >= 0)
		{
			return 6;
		}
		if (stripos($type,"bigint") >= 0)
		{
			return 20;
		}
		if (stripos($type,"tinyint") >= 0)
		{
			return 16;
		}
		if (stripos($type,"decimal") >= 0)
		{
			return 14;
		}
		return 200;	
	}
	
	function getSchema()
	{
		$sSchema = "<?xml version='1.0' encoding='UTF-8' ?>\r\n";
		
		$sSchema .= "<metadata xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>\r\n";
		$sSchema .= "<default_database>\r\n";
		$sSchema .= "	<item name='" . $this->dbname . "' case_sens='0'/>\r\n";
		$sSchema .= "</default_database>\r\n";
//		$sSchema .= "<default_schemas>\r\n";
//		$sSchema .= "	<item name='" . $this->dbname . "' case_sens='0' />\r\n"; 
//		$sSchema .= "</default_schemas>\r\n";
	 	if (isset($this->db))
	 	{
			if ($this->dbtype == "mssql")
			{
				$sql = "SELECT * FROM INFORMATION_SCHEMA.TABLES";
				$result = mssql_query($sql);
				if (isset($result))
				{
					$tables = array(); 
					$types = array(); 
					while ($row = mssql_fetch_array($result)) 
					{ 
	   					$tables[] = $row[2]; 
	   					$types[] = $row[3]; 						
					}
					for ($n = 0;$n < count($tables);$n++) 
					{
						if ($types[$n] == "VIEW")
						{
							$sSchema .= "<view>\r\n";
							$sSchema .= "	<database>\r\n";
							$sSchema .= "		<item name='" . $this->dbname  . "' case_sens='0'/>\r\n";
							$sSchema .= "	</database>\r\n";
							$sSchema .= "	<name name='" . $tables[$n] . "' case_sens='0' />\r\n"; 
							$sSchema .= "	<system>0</system>\r\n"; 
							$sSchema .= "	<visible>1</visible>\r\n";
							$sSchema .= "	<fields>\r\n";
	
							$result = mssql_query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '" . $tables[$n] ."'" ); 
	
	   						while( $row = mssql_fetch_array($result) ) 
							{
								$sSchema .= "		<field>\r\n";
	
								$sSchema .= "			<name>\r\n";
								$sSchema .= "				<item name='" . $row[3] . "' case_sens='0'/>\r\n";
								$sSchema .= "			</name>\r\n";
	      						$sSchema .= "			<type>" . $this->getTypeCode($row[7]) . "</type>\r\n";
								$sSchema .= "		</field>\r\n";
						   	} 
							$sSchema .= "	</fields>\r\n";
							$sSchema .= "</view>\r\n";
						}
						if ($types[$n] == "BASE TABLE")
						{
							$sSchema .= "<table>\r\n";
							$sSchema .= "	<database>\r\n";
							$sSchema .= "		<item name='" . $this->dbname . "' case_sens='0'/>\r\n";
							$sSchema .= "	</database>\r\n";
							$sSchema .= "	<name name='" . $tables[$n] . "' case_sens='0' />\r\n"; 
							$sSchema .= "	<system>0</system>\r\n"; 
							$sSchema .= "	<visible>1</visible>\r\n";
							$sSchema .= "	<fields>\r\n";
	
							$result = mssql_query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '" . $tables[$n] . "'" ); 
	
							$keyfields = "";
	   						while( $row = mssql_fetch_row($result) ) 
							{
								$sSchema .= "		<field>\r\n";
	
								$sSchema .= "			<name>\r\n";
								$sSchema .= "				<item name='" . $row[3] . "' case_sens='0'/>\r\n";
								$sSchema .= "			</name>\r\n";
	
	      						$sSchema .= "			<type>" . $this->getTypeCode($row[7]) . "</type>\r\n";
								$sSchema .= "		</field>\r\n";
						   	} 
							if ($keyfields != "")
							{
								$keyfields .= "	</key_fields>\r\n";							
							}
							$sSchema .= "	</fields>\r\n";
							$sSchema .= $keyfields;
							$sSchema .= "</table>\r\n";
						}
					} 
				}
			}
			else if ($this->dbtype == "mysql")
			{
				$sql = "SHOW FULL TABLES FROM " . $this->dbname;
				$result = mysqli_query($this->dbconn,$sql);
				if (isset($result))
				{
					$tables = array(); 
					$types = array(); 
					while ($row = mysqli_fetch_array($result)) 
					{ 
	   					$tables[] = $row[0]; 
	   					$types[] = $row[1]; 
					} 
					for ($n = 0;$n < count($tables);$n++) 
					{
						if ($types[$n] == "VIEW")
						{
							$result = mysqli_query( $this->dbconn, "SHOW FIELDS FROM ".$tables[$n] ); 
	
							if (mysqli_error($this->dbconn) != "")
							{
								break;
							}
							$sSchema .= "<view>\r\n";
							$sSchema .= "	<database>\r\n";
							$sSchema .= "		<item name='" . $this->dbname . "' case_sens='0'/>\r\n";
							$sSchema .= "	</database>\r\n";
							$sSchema .= "	<name name='" . $tables[$n] . "' case_sens='0' />\r\n"; 
							$sSchema .= "	<system>0</system>\r\n"; 
							$sSchema .= "	<visible>1</visible>\r\n";
							$sSchema .= "	<fields>\r\n";
	
							while( $row = mysqli_fetch_array($result) ) 
							{
								$sSchema .= "		<field>\r\n";
	
								$sSchema .= "			<name>\r\n";
								$sSchema .= "				<item name='" . $row[0] . "' case_sens='0'/>\r\n";
								$sSchema .= "			</name>\r\n";
	      						$sSchema .= "			<type>" . $this->getTypeCode($row[1]) . "</type>\r\n";
								$sSchema .= "		</field>\r\n";
						   	} 
							$sSchema .= "	</fields>\r\n";
							$sSchema .= "</view>\r\n";
						}
						if ($types[$n] == "BASE TABLE")
						{
							$result = mysqli_query(  $this->dbconn, "SHOW FIELDS FROM ".$tables[$n]); 
							if (mysqli_error($this->dbconn) != "")
							{
								break;
							}
							$sSchema .= "<table>\r\n";
							$sSchema .= "	<database>\r\n";
							$sSchema .= "		<item name='" . $this->dbname . "' case_sens='0'/>\r\n";
							$sSchema .= "	</database>\r\n";
							$sSchema .= "	<name name='" . $tables[$n] . "' case_sens='0' />\r\n"; 
							$sSchema .= "	<system>0</system>\r\n"; 
							$sSchema .= "	<visible>1</visible>\r\n";
							$sSchema .= "	<fields>\r\n";
	
	
							$keyfields = "";
	   						while( $row = mysqli_fetch_row($result) ) 
							{
								$sSchema .= "		<field>\r\n";
	
								$sSchema .= "			<name>\r\n";
								$sSchema .= "				<item name='" . $row[0] . "' case_sens='0'/>\r\n";
								$sSchema .= "			</name>\r\n";
	
	      						$sSchema .= "			<type>" . $this->getTypeCode($row[1]) . "</type>\r\n";
	      						if ($row[3] == "PRI")
	      						{
	     							if ($keyfields == "")
	     								$keyfields = "	<key_fields>\r\n";
	     								
	    							$keyfields .= "		<field_name>\r\n";	
									$keyfields .= "			<item name='" . $row[0] . "' case_sens='0' />\r\n"; 
	    							$keyfields .= "		</field_name>\r\n";	
	      						}
								$sSchema .= "		</field>\r\n";
						   	} 
							if ($keyfields != "")
							{
								$keyfields .= "	</key_fields>\r\n";							
							}
							$sSchema .= "	</fields>\r\n";
							$sSchema .= $keyfields;
							$sSchema .= "</table>\r\n";
						}
					}					
				}
			}
			else if ($this->dbtype == "sqlite")
			{
				$sql = "select * from sqlite_master";
				$result = $this->db->query($sql);
				if (isset($result))
				{
					$tables = array(); 
					$types = array(); 
					while ($row = $result->fetch(SQLITE_ASSOC)) 
					{ 
	   					$tables[] = $row['name']; 
	   					$types[] = $row['type']; 
					} 
					for ($n = 0;$n < count($tables);$n++) 
					{
						if ($types[$n] == "view")
						{
							$result = $this->db->query( "select * from ".$tables[$n] . ' limit 1'); 
	
							if (!isset($result))
							{
								break;
							}
							$sSchema .= "<view>\r\n";
							$sSchema .= "	<database>\r\n";
							$sSchema .= "		<item name='" . $this->dbname . "' case_sens='0'/>\r\n";
							$sSchema .= "	</database>\r\n";
							$sSchema .= "	<name name='" . $tables[$n] . "' case_sens='0' />\r\n"; 
							$sSchema .= "	<system>0</system>\r\n"; 
							$sSchema .= "	<visible>1</visible>\r\n";
							$sSchema .= "	<fields>\r\n";
	
							if( $row = $result->fetch(SQLITE_ASSOC) ) 
							{
	
                                $cols = $this->db->fetchColumnTypes($tables[$n], SQLITE_ASSOC);
                                
                                foreach ($cols as $column => $type)
        					    {
    								$sSchema .= "		<field>\r\n";
    								$sSchema .= "			<name>\r\n";
    								$sSchema .= "				<item name='" . $column . "' case_sens='0'/>\r\n";
    								$sSchema .= "			</name>\r\n";
    	      						$sSchema .= "			<type>" . $type . "</type>\r\n";
    								$sSchema .= "		</field>\r\n";
                                }
						   	} 
							$sSchema .= "	</fields>\r\n";
							$sSchema .= "</view>\r\n";
						}
						if ($types[$n] == "table")
						{
							$result = $this->db->query( "select * from ".$tables[$n] . ' limit 1'); 
							if (!isset($result))
							{
								break;
							}
							$sSchema .= "<table>\r\n";
							$sSchema .= "	<database>\r\n";
							$sSchema .= "		<item name='" . $this->dbname . "' case_sens='0'/>\r\n";
							$sSchema .= "	</database>\r\n";
							$sSchema .= "	<name name='" . $tables[$n] . "' case_sens='0' />\r\n"; 
							$sSchema .= "	<system>0</system>\r\n"; 
							$sSchema .= "	<visible>1</visible>\r\n";
							$sSchema .= "	<fields>\r\n";
	
	
							$keyfields = "";
							if( $row = $result->fetch(SQLITE_ASSOC) ) 
							{
	
                                $cols = $this->db->fetchColumnTypes($tables[$n], SQLITE_ASSOC);
                                
                                foreach ($cols as $column => $type)
                                {
    								$sSchema .= "		<field>\r\n";
    								$sSchema .= "			<name>\r\n";
    								$sSchema .= "				<item name='" . $column . "' case_sens='0'/>\r\n";
    								$sSchema .= "			</name>\r\n";
    	      						$sSchema .= "			<type>" . $type . "</type>\r\n";
    								$sSchema .= "		</field>\r\n";
                                }
						   	} 
							if ($keyfields != "")
							{
								$keyfields .= "	</key_fields>\r\n";							
							}
							$sSchema .= "	</fields>\r\n";
							$sSchema .= $keyfields;
							$sSchema .= "</table>\r\n";
						}
					}					
				}
			}
		}		
		$sSchema .= "</metadata>";
		return $sSchema;	
	}
	
	function lastError()
	{
		if ($this->dbtype == "mysql")
		{
			return mysqli_error($this->dbconn);
		}
		if ($this->dbtype == "mssql")
		{
		    $err = mssql_get_last_message();
//		    writeFile("debug.txt",$err);
		    if (stripos($err,"Invalid") === false && 
                stripos($err,"Error") === false && 
                stripos($err,"Duplicate") === false && 
                stripos($err,"Terminated") === false && 
                stripos($err,"Incorrect") === false)
            {
                $err = "";
            }
//		    writeFile("debug.txt",$err);
			return $err;
		}
		if ($this->dbtype == "sqlite")
		{
		    return $this->err;
		}
		return "";		
	}
	
	function prepare($text)
	{
	  	if(get_magic_quotes_gpc()) 
  		{
    		$text = stripslashes($text);
  		}
		return $text;		
	}

	function isSuccess()
	{
		if ($this->dbtype == "mysql")
		{
			if (mysqli_error($this->dbconn) != "")
				return false;
		}
		if ($this->dbtype == "mssql")
		{
			if (!isset($this->result))
			{
				return false;
			}				
		}
		if ($this->dbtype == "sqlite")
		{
			if ($this->result == false)
			{
				return false;
			}				
		}
		return true;
	}
	
	function query($sql,$query_cnt = 1)
	{
		$sql = $this->prepare($sql);
	 	if (isset($this->db))
	 	{
	 	    $this->clear();
			try
			{
	 			if ($this->dbtype == "mssql")
					$this->result = mssql_query($sql);
	 			else if ($this->dbtype == "mysql")
	 			{
	 				if ($query_cnt == 1)
						$this->result = mysqli_query($this->dbconn,$sql);
					else
					{
						if (mysqli_multi_query($this->dbconn,$sql))
						{
							do
							{
								$this->result = mysqli_store_result($this->dbconn);
								$query_cnt--;
								if ($query_cnt == 0)
								{
									return $this->isSuccess();
								}
							} while (mysqli_next_result($this->dbconn));

						}						
					}
	 			}
	 			else if ($this->dbtype == "sqlite")
	 			{
	 			    $this->err = "";
	 				$this->result =	$this->db->query($sql, SQLITE_BOTH , $this->err );
	 				
	 				if ($this->result == false)
	 					return false;
 					return true;
	 			}
				$this->cleanup();
				return $this->isSuccess();
			}
			catch(Exception $e)
			{
			}
		}
		return false;
	}
	
	function cleanup()
	{
		if (!$this->isSuccess())
		{
			unset($this->result);
		}
	}
	
	function clear()
	{
	 	if (isset($this->result))
	 	{
	 		try
	 		{
				if ($this->dbtype == "mssql")
					mssql_free_result($this->result);
				if ($this->dbtype == "mysql")
					mysqli_free_result($this->result);	
				unset($this->result);
	 		}
			catch(Exception $e)
			{
			}
		}
	}
	
	function execute($sql,$multilines = false,$nobackup = false)
	{
        global $_excludes;
        
		if ($nobackup == null) $nobackup = false;			
		$sql = $this->prepare($sql);
	 	if (isset($this->db))
	 	{
	 	    $this->clear();
			try
			{
	 			if ($this->dbtype == "mssql")
					$this->result = mssql_query($sql);
	 			if ($this->dbtype == "mysql")
                {
   					$this->result = mysqli_query($this->dbconn,$sql);
                }
	 			if ($this->dbtype == "sqlite")
	 			{
	 			    $this->err = "";
					$this->result = $this->db->query($sql, SQLITE_ASSOC, $this->err);
                }
				if (isset($this->result))
				{
					$sql = strtolower($sql);
					if (stripos($sql,"transaction") !== FALSE)
					{
						unset($this->result);
						return true;						
					}
					if (stripos($sql,"create ") !== FALSE)
					{
						unset($this->result);
						return true;
					}
					if (stripos($sql,"drop ") !==  FALSE)
					{
						unset($this->result);
						return true;
					}
	                if ($this->lastError() == "" && _BACKUP && !$nobackup)
                    {
                        $exclude = FALSE;
                        foreach($_excludes as $tb)
                        {
                            if (stripos($sql,$tb) !== FALSE)
                            {
                                $exclude = TRUE;
                                break;
                            }
                        }
                        if (!$exclude)
                        {
                            $t = microtime(true);
                            $micro = sprintf("%06d",($t - floor($t)) * 1000000);
                            $dt = Date("YmdHis-".$micro,$t);
                            $path = realpath(dirname(__FILE__));
                            $path = str_replace("classes","",$path);
                            $fn  = $path . "backupdata/sql-$dt.txt";
                            file_put_contents($fn,$sql);
                        }
                    }
					$this->cleanup();
    				return $this->isSuccess();
				}
				else
				{
					return true;
				}
			}
			catch(Exception $e)
			{
			}
		}
		return false;
	}
	
	function executeNoResult($sql,$ignorerror = false)
	{
		$sql = $this->prepare($sql);
	 	if (isset($this->db))
	 	{
	 	    $this->clear();
			try
			{
	 			if ($this->dbtype == "mssql")
					$result = mssql_query($sql);
	 			if ($this->dbtype == "mysql")
					$result = mysqli_query($this->dbconn,$sql);
	 			if ($this->dbtype == "sqlite")
					$result = $this->db->query($sql, SQLITE_ASSOC, $sqliteerror);
				if (isset($result))
				{
					$sql = strtolower($sql);
					if (strpos($sql,"transaction") !== FALSE)
					{
						unset($result);
						return true;						
					}
					if (strpos($sql,"create ") !== FALSE)
					{
						unset($result);
						return true;
					}
					if (strpos($sql,"drop ") !== FALSE)
					{
						unset($result);
						return true;
					}
	                if ($this->lastError() == "" && _BACKUP)
                    {
                        $t = microtime(true);
                        $micro = sprintf("%06d",($t - floor($t)) * 1000000);
                        $dt = Date("YmdHis-".$micro,$t);
                        $path = realpath(dirname(__FILE__));
                        $path = str_replace("classes","",$path);
                        $fn  = $path . "backupdata/sql-$dt.txt";
                        file_put_contents($fn,$sql);
                    }
					if ($this->dbtype == "mysql")
					{
						if (mysqli_error($this->dbconn) != "")
							return false;
					}
					if ($this->dbtype == "mssql")
					{
						if (!isset($result))
						{
							return false;
						}				
					}
					if ($this->dbtype == "sqlite")
					{
						if ($result == false)
						{
							return false;
						}				
					}
					return true;
				}
				else
				{
					return true;
				}
			}
			catch(Exception $e)
			{
				if ($ignorerror == false)
					echo "999," . $sql . $e->getMessage();
			}
		}
		else
			echo ("999,Database Not Connected");	
		return false;
	}
	
	function records()
	{
	 	if (isset($this->result))
	 	{
 			if ($this->dbtype == "mssql")
 				return mssql_num_rows($this->result);
 			if ($this->dbtype == "mysql")
 				return mysqli_num_rows($this->result);
 			if ($this->dbtype == "sqlite")
 				return $this->result->numRows();
		}
		return 0;		
	}
	
	function recordcount()
	{
	 	if (isset($this->result))
	 	{
 			if ($this->dbtype == "mssql")
 				return mssql_num_rows($this->result);
 			if ($this->dbtype == "mysql")
 				return mysqli_num_rows($this->result);
 			if ($this->dbtype == "sqlite")
 				return $this->result->numRows();
		}
		return 0;		
	}
	
	function affected()
	{
	 	if (isset($this->db))
	 	{
 			if ($this->dbtype == "mssql")
		 	 	return mssql_rows_affected($this->dbconn);
 			if ($this->dbtype == "mysql")
		 	 	return mysqli_affected_rows($this->dbconn);
 			if ($this->dbtype == "sqlite")
 				return sqlite_changes ($this->result);
	 	}
	 	return 0;
	}

	function fieldlist()
	{
		$ret = "";
	 	if (isset($this->result))
	 	{
			for ($i = 0;$i < $this->fields();$i++)
			{
				$ret .= $this->fieldname($i);
				if ($i < $this->fields()-1)
					$ret .= ",";
			}
	 	}
	 	return $ret;
	}
	
	function fieldtypes($table = "")
	{
		$ret = "";
	 	if (isset($this->result))
	 	{
 			if ($this->dbtype == "sqlite")
 			{
 				$cols = sqlite_fetch_column_types($table, $this->db, SQLITE_ASSOC);
 				foreach ($cols as $column => $type) 
			 	{
    	 	     echo $type;
					$ret .= $type  . ",";			 		
				}
 			}
 			else
			{
				for ($i = 0;$i < $this->fields();$i++)
				{
 					if ($this->dbtype == "mssql")
						$type = mssql_field_type($this->result,$i);
 					if ($this->dbtype == "mysql")
 					{
 						$finfo = $this->result->fetch_field_direct($i);
  						$type = $finfo->type;
 					}
					$ret .= $type  . ",";
				}
			}
	 	}
	 	return $ret;
	}
	
	function fields()
	{
	 	if (isset($this->result))
	 	{
			if ($this->dbtype == "mssql")
		 	 	return mssql_num_fields($this->result);
			if ($this->dbtype == "mysql")
		 	 	return mysqli_num_fields($this->result);
			if ($this->dbtype == "sqlite")
		 	 	return $this->result->numFields();
		}
		return 0;		
	}

	function fieldname($index)
	{
	 	if (isset($this->result))
	 	{
			if ($this->dbtype == "mssql")
		 	 	return mssql_field_name($this->result,$index);
			if ($this->dbtype == "mysql")
			{
				$finfo = $this->result->fetch_field_direct($index);
				return $finfo->name;				
			}
			if ($this->dbtype == "sqlite")
			{
				return $this->result->fieldName($index);
			}
		}
		return 0;		
	}

	function moveto($recno)
	{
	 	if (isset($this->db))
	 	{
		 	if (isset($this->result))
		 	{
				if ($this->dbtype == "mssql")
				{
					return mssql_data_seek($this->result,$recno);
				}
				if ($this->dbtype == "mysql")
				{
					return mysqli_data_seek($this->result,$recno);
				}
				if ($this->dbtype == "sqlite")
				{
					return $this->result->seek($recno);
				}
			}
		}
		return false;
	}
	function fetchrow($bAll = false)
	{
	 	if (isset($this->db))
	 	{
		 	if (isset($this->result))
		 	{
				if ($this->dbtype == "mssql")
				{
					if ($this->recordcount() == 0)
						return false;
					if ($this->row = mssql_fetch_array($this->result,MSSQL_ASSOC))
					{
						return true;
					}			
				}
				else if ($this->dbtype == "mysql")
				{
					if (isset($this->result))
					{
						if ($this->recordcount() == 0)
							return false;
                        if ($bAll)
						  $this->row = mysqli_fetch_all($this->result,MYSQLI_ASSOC);
                        else
						  $this->row = mysqli_fetch_array($this->result,MYSQLI_ASSOC);
						if ($this->row == null)
							return false;
						return true;
					}
				}
				else if ($this->dbtype == "sqlite")
				{
					if (isset($this->result))
					{
						if ($this->recordcount() == 0)
							return false;
						$this->row = $this->result->fetch(SQLITE_ASSOC);
						if ($this->row == null)
							return false;
						return true;
					}
				}
			}
		}
		return false;
	}
	
	function field($name)
	{
	 	if (isset($this->db))
	 	{
		 	if (isset($this->result))
		 	{
				if (isset($this->row))
				{
					try
					{
						return $this->row[$name];
			 		}
					catch(Exception $e)
					{
						return "INVALID FIELD";
					}		
				}
			}
		}
		return "";
	}	
	
	function HTMLReplace($text)
	{
		$text = str_replace("&apos;","'",$text);
		$text = str_replace("&lt;","<",$text);
		$text = str_replace("&gt;",">",$text);
		return $text;
	}
	function modifytable($newschema,$oldschema)
	{
 		try
 		{
 			$newschema = $this->HTMLReplace($newschema);
 			$oldschema = $this->HTMLReplace($oldschema);
 			$xOldSchema = simplexml_load_string($oldschema);
 			$xNewSchema = simplexml_load_string($newschema);
 			if (!isset($xOldSchema))
 			{
				echo ("999,Invalid Old Schema");	
 				return false;
 			}
 			if (!isset($xNewSchema))
 			{
				echo ("999,Invalid New Schema");	
 				return false;
 			}
 			$sPrimaryKey = "";
 			$table = $xOldSchema->attributes()->name;
 			// Update new fields
			foreach($xNewSchema->field as $newfield)
			{
				$bFound = false;
				$name = strtolower($newfield->attributes()->name);
				$length = $newfield->attributes()->length;
				$decimals = $newfield->attributes()->decimals;
				$type = strtolower($newfield->attributes()->type);
				if ($type == "numeric")
					$type = "decimal";
				if ($newfield->attributes()->primary == "Y")
				{
					if ($sPrimaryKey != "")
						$sPrimaryKey .= "," . $newfield->attributes()->name;
					else
						$sPrimaryKey .= $newfield->attributes()->name;
				}
				// Look for the field in the old schema
				foreach($xOldSchema->field as $oldfield)
				{
					$oldname = strtolower($oldfield->attributes()->name);
					if ($name == $oldname)
					{
						// Found the field in the old schema
						$bFound = true;
						$sql = "alter table $table change column " . $oldfield->attributes()->name . "  " . $newfield->attributes()->name . " $type";
						if ($type == "varchar")
							$sql .= "(" . $length . ")";
						if ($type == "decimal")
							$sql .= "(10," . $decimals . ")";
						$this->execute($sql,true);						
					}
				}
				if ($bFound == false)
				{
					$sql = "alter table $table add column " . $newfield->attributes()->name . " $type";
					if ($type == "varchar")
						$sql .= "(" . $length . ")";
					if ($type == "decimal")
						$sql .= "(10," . $decimals . ")";
					$this->execute($sql,true);
				}	
			}
			// Look for deleted fields
			foreach($xOldSchema->field as $oldfield)
			{
				$bFound = false;
				$name = strtolower($oldfield->attributes()->name);
				// Look for the field in the new schema
				foreach($xNewSchema->field as $newfield)
				{
					$newname = strtolower($newfield->attributes()->name);
					if ($name === $newname)
					{
						// Found the field in the new schema
						$bFound = true;
					}
				}
				if ($bFound == false)
				{
					$sql = "alter table $table drop column ". $oldfield->attributes()->name;
					$this->execute($sql,true);
				}	
			}
			if ($sPrimaryKey != "")
			{
				$this->execute("alter table $table drop primary key;",true);
				$this->execute("alter table $table add primary key ($sPrimaryKey);",true);
			}
			return true;	
 		}
		catch(Exception $e)
		{
		}
		return false;	
	}
	
	function close()
	{
	 	if (isset($this->db))
	 	{
	 	    $this->clear();
		 	if (isset($this->result))
		 	{
		 		try
		 		{
					unset($this->result);	
					$this->db = null;
		 		}
				catch(Exception $e)
				{
				}
			}
			$this->dbconn = null;
		}		
	}
	
 	function __destruct() 
	{
		$this->close();
        foreach ($this as $index => $value) unset($this->$index);
	} 	
}
?>