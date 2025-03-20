import { Container, Paper, Typography, Button, LinearProgress, Grid } from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../auth/AuthContext";

export const UploadLicense = () => {
  const url="http://localhost:8080";
  //const url = 'https://carpool-service-test-cvklf2agbq-de.a.run.app/'
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [licenseImage, setLicenseImage] = useState(null);
  const fileInputRef = useRef(null);
  const { userToken } = useAuth();

  useEffect(() => {
    const fetchLicenseImage = async () => {
      try {
        if (!userToken) {
          return;
        }

        const response = await fetch(url+`/get-user-license/${userToken.user_id}`, {
          headers: {
            Authorization: `Bearer ${userToken.access_token}`,
          },
        });

        if (response.ok) {
          const blob = await response.blob();
          setLicenseImage(URL.createObjectURL(blob));
        } else {
          console.error("Failed to fetch license image");
        }
      } catch (error) {
        console.error("Error fetching license image:", error);
      }
    };

    if (userToken) {
      fetchLicenseImage();
    }
  }, [userToken]);

  const handleUpload = async () => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("license_file", fileInputRef.current.files[0]);

      const response = await fetch(url+`/update-user-license?userid=${userToken.user_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken.access_token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        navigate('/user');
      } else {
        console.error("Failed to upload or update license image");
        alert("Failed to upload or update license image");
      }
    } catch (error) {
      console.error("Error uploading or updating license image:", error);
    } finally {
      setUploading(false);
    }
  };
  const handleDelete = async (file) => {
    try {
      setUploading(true);

      const response = await fetch(url+`/delete-user-license/${userToken.user_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken.access_token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setLicenseImage(null);
      } else {
        console.error("Failed to delete license image");
      }
    } catch (error) {
      console.error("Error deleting license image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container style={{ marginTop: 20 }}>
      <Paper elevation={3} style={{ padding: 20 }}>
        <Typography variant="h4" style={{ marginBottom: 20 }}>
          上傳駕照
        </Typography>
        <hr />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <img
                  src={licenseImage}
                  alt="Uploaded License"
                  style={{ maxWidth: "100%", marginBottom: 20 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={uploading}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={() => setLicenseImage(fileInputRef.current.files[0])}
                  style={{ marginBottom: 20 }}
                  id="fileInput" // add an ID to reference in the label
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  Upload
                </Button>
                {uploading && <LinearProgress style={{ marginTop: 20 }} />}
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={uploading}
                  onClick={() => navigate('/user')}
                >
                  Done
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UploadLicense;
